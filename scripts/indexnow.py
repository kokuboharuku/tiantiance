"""Notify changed public URLs after successful deployment; no private credentials."""
import argparse,json,os,re,subprocess,urllib.request,urllib.error
from pathlib import Path
BASE='https://gd.tiantiance.blog'
def main():
 p=argparse.ArgumentParser();p.add_argument('--root',default='.published');p.add_argument('--dry-run',action='store_true');args=p.parse_args()
 previous=os.environ.get('PREVIOUS_SHA',''); root=Path(args.root)
 urls=json.loads((root/'search-notification.json').read_text())['urls']
 # Reader-facing source changes affect navigation, related links or generated collections.
 # Documentation-only changes never notify unchanged site pages.
 if re.fullmatch('[0-9a-f]{40}',previous) and set(previous)!={'0'}:
  diff=subprocess.run(['git','diff','--name-only',previous,'HEAD'],capture_output=True,text=True)
  if diff.returncode==0 and not any(x.startswith(('docs/','data/','scripts/')) or x=='indexnow-key.txt' for x in diff.stdout.splitlines()):
   print('No published page changes; IndexNow skipped.');return
 key=Path('indexnow-key.txt').read_text().strip()
 if not re.fullmatch('[a-zA-Z0-9-]{8,128}',key) or any(not u.startswith(BASE+'/') for u in urls) or len(urls)>10000:raise ValueError('Invalid submission scope')
 payload={'host':'gd.tiantiance.blog','key':key,'keyLocation':BASE+'/'+key+'.txt','urlList':sorted(set(urls))}
 if args.dry_run:print(json.dumps({'count':len(payload['urlList']),'host':payload['host']}));return
 req=urllib.request.Request('https://api.indexnow.org/indexnow',data=json.dumps(payload).encode(),headers={'Content-Type':'application/json; charset=utf-8','User-Agent':'TTC-IndexNow/1.0'},method='POST')
 with urllib.request.urlopen(req,timeout=30) as response:status=response.status
 if status not in (200,202):raise RuntimeError(f'IndexNow HTTP {status}')
 msg=f'IndexNow HTTP {status}: {len(payload["urlList"])} URLs accepted; search indexing is not verified.'
 print(msg)
 if os.environ.get('GITHUB_STEP_SUMMARY'):
  with open(os.environ['GITHUB_STEP_SUMMARY'],'a') as f:f.write(msg+'\n')
if __name__=='__main__':main()
