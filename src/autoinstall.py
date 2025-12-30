import os
import requests

distro = input()

def minify(a):
  a = {'input': a}
  return requests.post('https://www.toptal.com/developers/javascript-minifier/api/raw',data=a).text

j = os.listdir('System/Library')
t = os.listdir(f"Distros/{distro}")

j = ["System/Library/" + i for i in j if not i[0] == '.' and '.' in i and not i in t]
j.extend([f"Distros/{distro}/" + i for i in t if not i[0] == '.' and '.' in i])
x = []
for i in j:
  f = open(i)
  x.append({'name': i, 'contents': minify(f.read())})
  f.close()

f = open('install.js', 'w')
f.write('api.getBlock(0,1e5, -1) \n')
f.write("api.setBlockData(0,1e5, -1, {persisted: {shared: {fileCount: " + str(len(x) + 3) + "}}}) \n")
f.write("setFile(0, {name:  'root', extension: '', contents: [1, 13]}) \n")
f.write("setFile(1, {name: 'System', extension: '', contents: [2]}) \n")
f.write("setFile(2, {name: 'User', extension: '', contents: []})")
f.write("setFile(3, {name: 'Library', extension: '', contents:"+ str(list(range(4, len(x) + 4)))+"})\n")

for i in range(len(x)):
  j  = x[i]['name'].split('.')
  if j[1] == 'js':
    j[1] = 'pack'
  j[1] = '.' + j[1]

  f.write(f"setFile({i + 3}, ")
  f.write("{name: '" + j[0] + "',")
  f.write("extension: '" + j[1] + "',")
  f.write("contents: '" + x[i]['contents'] + "'}) \n")
f.close()
