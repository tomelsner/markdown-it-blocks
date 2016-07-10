import {VideoServiceBase} from './VideoServiceBase';


export class YouTubeService extends VideoServiceBase {

  getDefaultOptions() {
    return { width: 640, height: 390 };
  }

  extractVideoID(reference) {
    let match = reference.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&\?]*).*/);
    return match && match[7].length === 11 ? match[7] : reference;
  }

  getVideoUrl(videoID) {
    return '//www.youtube.com/embed/' + videoID;
  }

}
