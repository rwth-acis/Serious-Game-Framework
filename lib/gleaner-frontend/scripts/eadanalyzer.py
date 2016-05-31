import sys
import xml.sax
import zipfile
import redis
import shutil
import os
from pymongo import MongoClient
from bson.objectid import ObjectId

if len(sys.argv) < 3:
    raise ValueError('Missing arguments. First argument must be the path to .ead, second, a version id string')

scenes = {'nodes': {}}
flags = []
vars = []
conversations = []

ead_path = sys.argv[1]
version = sys.argv[2]
r = redis.StrictRedis(host='localhost', port=6379, db=0)

ead_zip = zipfile.ZipFile(ead_path, 'r')

class AnimationHandler(xml.sax.ContentHandler):
    def __init__(self):
        xml.sax.ContentHandler.__init__(self)
        self.uri = None

    def startElement(self, name, attrs):
        if name == 'frame' and 'type' in attrs and attrs['type'] == 'image' and self.uri is None:
            self.uri = attrs['uri']


class ChapterHandler(xml.sax.ContentHandler):
    def __init__(self):
        xml.sax.ContentHandler.__init__(self)
        self.currentScene = None
        self.currentSceneId = None
        self.x = 0
        self.y = 0
        self.waitingBg = False
        self.current_conversation = None
        self.current_optionNode = None
        self.read_line = False
        self.line = ''

    def startElement(self, name, attrs):
        if name in ['scene', 'slidescene', 'videoscene']:
            id = attrs['id']
            # Check if it's initial scene
            if attrs['start'] == 'yes':
                scenes['root'] = id


            links = []
            if 'idTarget' in attrs:
                links.append(attrs['idTarget'])

            scene = {
                'links': links
            }

            scenes['nodes'][id] = scene
            self.currentScene = scene
            self.currentSceneId = id
        elif name == 'exit':
            next_scene = attrs['idTarget']
            if next_scene not in self.currentScene['links'] and next_scene != self.currentSceneId:
                self.currentScene['links'].append(attrs['idTarget'])
        elif name == 'resources':
            self.waitingBg = True
        elif self.waitingBg and name == 'asset'and 'type' in attrs and attrs['type'] in ['background', 'slides']:
            self.currentScene['background'] = self.extract_bg(attrs['uri'])
        elif name in ['active', 'inactive']:
            flag = attrs['flag']
            if flag not in flags:
                flags.append(flag)
        elif name in ['set-value', 'increment', 'decrement']:
            var = attrs['var']
            if var not in vars:
                vars.append(var)
        elif name == 'graph-conversation':
            self.current_conversation = {
                'id': attrs['id'],
                'optionNodes': []
            }
            conversations.append(self.current_conversation)
        elif name == 'option-node':
            self.current_optionNode = {
                'options': []
            }
            self.current_conversation['optionNodes'].append(self.current_optionNode)
        elif name == 'speak-player' and self.current_optionNode is not None:
            self.read_line = True
            self.line = ''

    def characters(self, content):
        if self.read_line:
            self.line += content

    def endElement(self, name):
        if name == 'resources':
            self.waitingBg = False
        elif name == 'graph-conversation':
            self.current_conversation = None
        elif name == 'option-node':
            self.current_optionNode = None
        elif name == 'speak-player'and self.current_optionNode is not None:
            self.read_line = False
            self.current_optionNode['options'].append(self.line)
            self.line = ''


    def extract_bg(self, uri):
        uri = self.add_extension(uri)
        if uri.endswith('.eaa'):
            handler = AnimationHandler()
            parser = xml.sax.make_parser()
            parser.setFeature(xml.sax.handler.feature_validation, False)
            parser.setFeature(xml.sax.handler.feature_external_ges, False)
            parser.setContentHandler(handler)
            parser.parse(ead_zip.open(uri))
            if handler.uri is not None:
                return self.extract_bg(handler.uri)
        else:
            image_id = str(r.incr('images'))
            folder = str(image_id).zfill(4)
            image_folder = 'uploads/' + folder[0:2] + '/' + folder[2:4] + '/'
            ead_zip.extract(uri, 'tmp' + image_id)
            os.makedirs(image_folder)
            final_path = image_folder + image_id + os.path.splitext(uri)[1]
            shutil.move('tmp' + image_id + '/' + uri, final_path)
            shutil.rmtree('tmp' + image_id)
            return final_path

    def add_extension(self, uri):
        path, extension = os.path.splitext(uri)
        if extension == '':
            try:
                ead_zip.getinfo(uri + '.eaa')
                return uri + '.eaa'
            except KeyError:
                pass

            try:
                ead_zip.getinfo(uri + '_01.jpg')
                return uri + '_01.jpg'
            except KeyError:
                pass

            try:
                ead_zip.getinfo(uri + '_01.png')
                return uri + '_01.png'
            except KeyError:
                pass
        else:
            return uri


parser = xml.sax.make_parser()
parser.setFeature(xml.sax.handler.feature_validation, False)
parser.setFeature(xml.sax.handler.feature_external_ges, False)
parser.setContentHandler(ChapterHandler())

try:
    i = 1
    while True:
        ead_zip.getinfo("chapter" + str(i) + ".xml")
        parser.parse(ead_zip.open("chapter" + str(i) + ".xml"))
        i += 1
except KeyError:
    pass


# Set scenes coordinates
nodes = scenes['nodes']
processed = []
root = nodes[scenes['root']]


max_y = 3

def process(id, node, count):
    if id in processed:
        return count - 1
    else:
        node['x'] = int(count / max_y)
        node['y'] = count % max_y
        processed.append(id)
        for link in node['links']:
            count = process(link, nodes[link], count + 1)
        return count


count = process(scenes['root'], root, 0)

for node in nodes:
    count = process(node, nodes[node], count + 1)

# Create choices
choices = []
for conversation in conversations:
    i = 0
    for option in conversation['optionNodes']:
        if len(option['options']) > 0:
            choices.append({
                'id': conversation['id'] + str(i),
                'options': option['options']
            })
            i += 1


client = MongoClient()
db = client['gleaner']
db.versions.find_and_modify(query={"_id": ObjectId(version)}, update={'$set': {'zones': scenes, 'loading': False, 'flags': flags, 'vars': vars, 'choices': choices}})
client.disconnect()