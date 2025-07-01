Industrial Metaverse @ DF Kiel
A comprehensive 3D industrial visualization application built with Babylon.js that provides an immersive metaverse experience for industrial environments. The application features XR/AR support, real-time MQTT communication, and interactive 3D GUI elements.

🌟 Features
3D Industrial Scene: Interactive 3D environment with multiple industrial machines and equipment
XR/AR Support: Full WebXR integration for immersive VR/AR experiences
Real-time Communication: MQTT integration for live data streaming via HiveMQ Cloud
Interactive 3D GUI: State and name display panels with XR compatibility
Multiple Industrial Models: Pre-loaded collection of industrial equipment (AGV, DMC, DMU, Roboter, etc.)
Dynamic Model Management: Toggle visibility and enable/disable models dynamically
Responsive Design: Full-screen canvas with touch support for mobile devices
🚀 Quick Start
Open the HTML file in a modern web browser
XR/AR Requirements: For XR features, use a WebXR-compatible browser and device
MQTT Connection: The application automatically connects to HiveMQ Cloud for real-time data
🛠 Technical Stack
Babylon.js: 3D rendering engine
WebXR: Extended Reality support
MQTT.js: Real-time messaging protocol
HiveMQ Cloud: MQTT broker service
dat.GUI: Development debugging interface
📋 Dependencies
All dependencies are loaded via CDN:

Babylon.js Core & Extensions
Physics Engines (Havok, Ammo, Cannon, Oimo)
Material & Procedural Texture Libraries
Post-processing Effects
3D GUI System
MQTT Client Library
dat.GUI for debugging
🏭 Industrial Models
The application includes the following industrial equipment models:

Model	Description	Special Features
AGV_small	Automated Guided Vehicle	Mobile transport unit
Beam_small	Industrial beam structure	Structural component
DMC_small	DMC milling machine	Precision machining
DMU_small	DMU milling unit	Advanced milling
E500_small	E500 equipment	Industrial equipment
FZ12_small	FZ12 unit	Positioned at (21,0,0)
G350_small	G350 machine	Manufacturing unit
GR300C_small	GR300C equipment	Industrial component
Roboter_small	Industrial robot	Automated robotics
🎮 Controls & Interaction
Camera Controls
Mouse: Orbit around the scene
Scroll: Zoom in/out
Touch: Mobile-friendly touch controls
3D GUI Interaction
Click GUI Panel: Toggle between states (Aktiv/Inaktiv/Wartend)
Color Coding:
Green: Active state
Red: Inactive state
Orange: Waiting state
XR Controls
Hand Tracking: Natural hand interactions in XR mode
Gaze Interaction: Look-based selection
Controller Support: Full XR controller integration
🌐 MQTT Configuration
The application connects to HiveMQ Cloud with the following configuration:

javascript
const options = {
    username: 'babylon2',
    password: 'TuY-Gv6iM$rx.tX',
    clientId: 'webclient_' + Math.random().toString(16).substr(2, 8),
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 4000
};
Topic: test/topic Protocol: WSS (WebSocket Secure) Port: 8884

🔧 Customization
Adding New Models
javascript
const newModel = {
    url: "path/to/your/model.glb",
    name: "YourModelName",
    position: new BABYLON.Vector3(x, y, z) // Optional
};
models.push(newModel);
Model Management Functions
javascript
// Toggle visibility
toggleVisibility("ModelName");

// Enable/Disable model
setEnabled("ModelName", true/false);
GUI Customization
javascript
// Modify states
const states = ["Aktiv", "Inaktiv", "Wartend", "YourCustomState"];

// Modify names
const names = ["Objekt-001", "YourCustomName"];

// Customize colors
function getStateColor(state) {
    switch(state) {
        case "YourState": return "blue";
        // ... other cases
    }
}
🎯 Use Cases
Industrial Training: Virtual training environments for factory workers
Equipment Monitoring: Real-time visualization of machine states
Remote Inspection: XR-based remote equipment inspection
Process Optimization: 3D visualization of industrial processes
Digital Twin: Virtual representation of physical industrial systems
📱 Device Compatibility
Desktop
Chrome 79+ (recommended)
Firefox 70+
Safari 13+
Edge 79+
Mobile
iOS Safari 13+
Chrome Mobile 79+
Samsung Internet 10+
XR Devices
Oculus Quest/Quest 2
HoloLens 2
Magic Leap 2
WebXR-compatible headsets
🔒 Security Notes
MQTT credentials are embedded for demonstration purposes
For production use, implement proper authentication
Consider using environment variables for sensitive data
🐛 Troubleshooting
Common Issues
Models not loading: Check internet connection and model URLs
XR not working: Ensure HTTPS connection and WebXR-compatible device
MQTT connection failed: Verify network connectivity and credentials
Performance issues: Reduce model complexity or disable unused features
Debug Mode
The application includes dat.GUI for debugging. Access browser developer tools for additional debugging information.

📄 License
This project is developed for educational and research purposes at DF Kiel.

🤝 Contributing
For contributions and improvements, please contact the development team at DF Kiel.

📞 Support
For technical support and questions:

Institution: DF Kiel (Fachhochschule Kiel)
Project: Industrial Metaverse Initiative
Note: This application demonstrates cutting-edge web technologies for industrial metaverse applications. It serves as a foundation for advanced industrial visualization and interaction systems.

