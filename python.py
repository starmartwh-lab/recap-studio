import os
import requests
import yt_dlp
from openai import OpenAI

# Initialize OpenAI
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def run_recap_pipeline(movie_title):
    print(f"[*] Starting automation for: {movie_title}")
    
    # Step 1: AI Script Generation with Visual Recommendations
    script_prompt = f"""
    Write a 60-second viral video recap script for '{movie_title}'.
    Format the response as a JSON array containing objects with text lines and visual keywords for clip matching.
    Example output format:
    [
      {{"text": "A man enters a dream inside a dream, but things go wrong instantly.", "keyword": "Inception kick scene scene trailer"}}
    ]
    Do not add extra formatting outside the raw JSON.
    """
    
    chat_response = client.chat.completions.create(
        model="gpt-4o",
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": script_prompt}]
    )
    
    # Process structured segments
    import json
    pipeline_data = json.loads(chat_response.choices.message.content)
    
    # Step 2: Voice Generation (ElevenLabs)
    voice_url = "https://elevenlabs.io"
    headers = {"xi-api-key": os.environ.get("ELEVENLABS_API_KEY"), "Content-Type": "application/json"}
    
    full_text = " ".join([seg['text'] for seg in pipeline_data['segments']])
    voice_res = requests.post(voice_url, json={"text": full_text, "model_id": "eleven_monolingual_v1"}, headers=headers)
    
    with open("./assets/voiceover.mp3", "wb") as f:
        f.write(voice_res.content)

    # Step 3: Targeted Automated Clip Acquisition
    # We download the official movie trailer to slice snippets from safely
    ydl_opts = {
        'format': 'bestvideo[height<=1080]+bestaudio/best',
        'outtmpl': './assets/raw_source.mp4',
        'merge_output_format': 'mp4',
        'noplaylist': True,
    }
    
    search_query = f"ytsearch1:{movie_title} official trailer"
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([search_query])
        
    print("[+] Assets prepared successfully.")
    return pipeline_data
