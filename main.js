let TEST_CASE = 'H264';
// TEST_CASE = 'H265';

let PROPERTY_ID = 'TRANG_TEST';
let SECURITY_TOKEN = '6a4ef6b8a229435eba1273d5235aba1e';
let url = 'https://live-on-v2-akm.akamaized.net/manifest/test_live/master.m3u8';

if (TEST_CASE === 'H265') {
  PROPERTY_ID = 'Default_CDN';
  SECURITY_TOKEN = '64987dc664010ee1bb271aedc0031f';
  url =
    'https://live-on-v2-cdnetwork.sigmaott.com/manifest/vtv1-hevc/master_clear.m3u8';
}

document.getElementById('url').value = url;

const cdnId2Name = {
  1: 'akamai',
  3: 'cdnetwork',
  peer: 'peer',
  5: 'vndt'
};
let total;
let downloaded = 0;
let peerUploaded = 0;

function play() {
  url = document.getElementById('url').value;

  if (window.hlsMng) {
    window.hlsMng.destroy();
  }
  total = {
    peer: 0,
  };
  refreshStats();
  initializePlayer();
}

function updateDownloaded(cdnId, downloadSize) {
  console.log("cdnId ", cdnId)
  downloaded += downloadSize / 1024 / 1024;
  const cdnName = cdnId2Name[cdnId];
  if (!total[cdnName]) {
    total[cdnName] = 0;
  }
  // console.log({ cdnName, downloadSize });
  total[cdnName] += downloadSize / 1024 / 1024;
}

function refreshStats() {
  const elm = document.getElementById('time-log');
  let text = `${TEST_CASE}`;
  text += '\n----------------------------------\n';
  text += Object.keys(total)
    .map((cdnName) => {
      return (
        cdnName +
        ': ' +
        total[cdnName].toFixed(2) +
        ' MB = ' +
        ((total[cdnName] * 100) / downloaded).toFixed(1) +
        '%'
      );
    })
    .join('\n');
  text += '\n----------------------------------';
  text += '\nuploaded: ' + (peerUploaded / 1024 / 1024).toFixed(2) + ' MB';
  text += '\n----------------------------------';
  text += '\nTotal: ' + downloaded.toFixed(2) + ' MB';
  elm.innerText = text;
  // console.log('refreshStats ', text);
}
/**
 * ---------------------------------------------------------------------------------------------------------------------------------
 */
function initializePlayer() {
  const video = (window.video = document.getElementById('video'));
  const hls = new Hls({
    progressive: true,
    backBufferLength: 12,
    debug: true,
  });
  hls.attachMedia(video);
  hls.on(Hls.Events.MEDIA_ATTACHED, function (e) {
    console.log('MEDIA_ATTACHED loaded');
  });
  hls.on(Hls.Events.MANIFEST_LOADED, function (e) {
    console.log('MANIFEST_LOADED loaded');
  });
  hls.on(Hls.Events.FRAG_LOADED, function (e) {
    // console.log('FRAG_LOADED loaded');
  });
  hls.on(Hls.Events.INIT_PTS_FOUND, function (_, data) {
    console.log('INIT_PTS_FOUND ', data);
  });
  hls.on(Hls.Events.ERROR, function (e, data) {
    console.error('Hls Error: ', e, data);
  });

  window.Pilot.addConfigListener(() => {
    window.Pilot.configHls(hls, Hls.version);
    
   const config =   window.Pilot.loadConfig(PROPERTY_ID);
   console.log("***config ", config) 
    hls.loadSource(url);
  });
  window.Pilot.addSegmentListener((evt) => {
    console.log("***evt ", evt)
    const { cdnId, loaded } = evt;
    updateDownloaded(cdnId, loaded);
    refreshStats();
  });
  window.Pilot.addListener('uploaded', (evt) => {
    const { uploaded = 0 } = evt;
    peerUploaded += uploaded;
    refreshStats();
  });
  window.Pilot.initPilot(SECURITY_TOKEN);
  window.hlsMng = hls;
}

window.Pilot.enableLogs && window.Pilot.enableLogs(true);
play();
