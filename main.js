(async function() {
    const isARSupported = navigator.xr && navigator.xr.isSessionSupported('immersive-ar');
})();

// container class to manage the XR scene
class XRScene {
    AXRSession = async () => {
        try {
            const session = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['local', 'dom-overlay'],
                domOverlay: { root: document.getElementById('overlay') }
            });
            this.onSessionStarted(session);
        } 

        // create an XRcanvas to contain camera and background in scene
        this.XRCanvas();
        this.gl = this.canvas.getContext('webgl', { xrCompatible: true });

        // create a scene to contain the camera and background
        this.scene = new THREE.Scene();

        // create a camera to view the scene
}

// canvas element for WebGL rendering
XRScene.XRCanvas = () => {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
    document.body.appendChild(this.canvas);
}

// session start
XRScene.onSessionStarted = (session) => {
    this.session = session;
    session.addEventListener('end', this.onSessionEnded);

    this.session.baseLayer = new XRWebGLLayer(this.session, this.gl);
    this.session.requestReferenceSpace('local').then((refSpace) => {
        this.refSpace = refSpace;
        this.session.requestAnimationFrame(this.onXRFrame);
    });
}

// session end
XRScene.onSessionEnded = (event) => {
    this.session.removeEventListener('end', this.onSessionEnded);
    this.session = null;
    this.refSpace = null;
    this.gl = null;
}

