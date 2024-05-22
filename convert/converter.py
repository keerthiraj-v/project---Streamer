import os
import ffmpeg
from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "<p>Python video convertor</p>"

@app.route("/convert/<video>")
def convert(video):
    filename = video.split('.')
    path = os.path.join('library', filename[0])
    os.mkdir(path)

    input_video = 'library/'+video
    output_playlist = 'library/'+filename[0]+'/'+filename[0]+'.m3u8'
    convert_to_hls(input_video, output_playlist)
    return "<p>Video converted successfully</p>"


def convert_to_hls(video_path, output_path):
    output_dir = output_path.rsplit('/', 1)[0]
    (
        ffmpeg
        .input(video_path)
        .output(output_path, format='hls', hls_time=10, hls_playlist_type='vod', hls_segment_filename=f'{output_dir}/%03d.ts')
        .run()
    )