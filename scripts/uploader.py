# -*- coding: utf-8 -*-
import os
import sys
from telethon.sync import TelegramClient
from telethon.sessions import StringSession

def upload(api_id, api_hash, session, target, file, description = ""):
    with TelegramClient(StringSession(session), api_id, api_hash, device_model="Kotatogram builds uploader", system_version="GitHub Actions") as client:
        client.send_file(target, file, caption=description)

if __name__ == '__main__':
    if len(sys.argv) <= 2:
        print("You should specify both a target and a file!")
        exit(1)

    api_id = int(os.environ['TELETHON_API_ID'])
    api_hash = os.environ['TELETHON_API_HASH']
    session = os.environ['TELETHON_SESSION']
    description = sys.argv[3] if len(sys.argv) > 3 else ""
    upload(api_id, api_hash, session, sys.argv[1], sys.argv[2], description)
