
/**
 * @type {import('@castlabs/prestoplay').clpp}
 */
const clpp = window.clpp

// Install the SDK and create a player:

clpp.install(clpp.hls.HlsComponent);

const anchorEl = document.getElementById('video-anchor');
const player = new clpp.interstitial.Player({
  config: {
    // If the app/website is hosted on a domain, then a license is required
    // license: '...',
    streaming: {
      // Set to false if you want to use the HLS component on Safari
      // instead of the default native playback
      preferNativeHlsOnSafari: false,
    },
  },
  anchorEl,
  // Hint: this value must be lower than the gap between any two interstitials
  // (end to start) and also lower than the start time of the first interstitial
  // (relative to the start of the primary content)
  resolutionOffsetSec: 30,
});
window.player = player


// Log events to console:

player.on('interstitial-started', (event) => {
  console.info('EEE interstitial-started', event.detail);
});
player.on('interstitial-ended', (event) => {
  console.info('EEE interstitial-ended', event.detail);
});
player.on('interstitial-item-started', (event) => {
  console.info('EEE interstitial-item-started', event.detail);
});
player.on('primary-player-changed', (event) => {
  window.primary = event.detail.player;
  console.info('EEE primary-player-changed', event.detail);
});
player.on('primary-started', (event) => {
  console.info('EEE primary-started', event.detail);
});
player.on('playback-started', (event) => {
  console.info('EEE playback-started', event.detail);
});
player.on('primary-ended', (event) => {
  console.info('EEE primary-ended', event.detail);
});
player.on('interstitial-preload-started', (event) => {
  console.info('EEE interstitial-preload-started', event.detail);
});
player.on('x-asset-list-request-started', (event) => {
  console.info('EEE x-asset-list-request-started', event.detail);
});
player.on('x-asset-list-request-ended', (event) => {
  console.info('EEE x-asset-list-request-ended', event.detail);
});
player.on('interstitial-scheduled', (event) => {
  console.info('EEE interstitial-scheduled', event.detail);
});


// Enable buttons:

/**
 * @type {HTMLButtonElement}
 */
const loadButton = document.getElementById('btn-load')
/**
 * @type {HTMLButtonElement}
 */
const unpauseButton = document.getElementById('btn-unpause')


loadButton.addEventListener('click', () => {
  loadButton.disabled = true

  console.info('Load')
  player.loadPaused({
    // AIP assets
    source: 'https://content.players.castlabs.com/api-interstitials-v3/vod-fixed.m3u8',
    // source: 'https://content.players.castlabs.com/api-interstitials-v3/vod-preroll.m3u8'
  }).then(() => {
    console.info('Loaded')
    unpauseButton.disabled = false
  }).catch((e) => {
    console.error('Load failed', e)
    loadButton.disabled = false
  })
});

unpauseButton.addEventListener('click', () => {
  console.info('Unpause')
  player.unpause().then(() => {
    console.info('Unpaused')
    unpauseButton.disabled = true
  }).catch((e) => {
    console.error('Unpause failed', e)
  })
});


// Visualize the position in UI:

const uiPositionEl = document.getElementById('ui-position')
if (uiPositionEl) {
  setInterval(() => {
    const p = (player.getPosition() ?? 0).toFixed(1)
    uiPositionEl.innerHTML = `Position: ${p} sec`
  }, 400);
}

const uiPrimaryPositionEl = document.getElementById('ui-position-primary')
let disposer = () => {}
player.on('item-changed', () => {
  const item = player.getCurrentItem()
  disposer()
  if (!item || !item.player) return
  if (item.primary) {
    const player = item.player
    const onTime = () => {
      const p = player.getPosition()
      const d = player.getDuration()
      uiPrimaryPositionEl.innerHTML = `Primary position: ${p.toFixed(1)} / ${d.toFixed(1)} sec`
    }
    player.on('timeupdate', onTime)
    disposer = () => {
      player.off('timeupdate', onTime)
    }
  }
})
