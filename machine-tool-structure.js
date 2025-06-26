// Methode 1: Direkte Integration in das bestehende async Script
(async function() {
  
  // OPC UA Machine Tool Datenstruktur direkt im Script definieren
  const MachineToolDataStructure = {
    // Header Informationen
    header: {
      instanceId: "string",
      sender: "string",
      version: "string",
      deviceModelName: "string",
      creationTime: "ISO8601",
      testIndicator: "boolean",
      bufferSize: "number",
      nextSequence: "number",
      firstSequence: "number",
      lastSequence: "number"
    },

    // Geräte-Informationen
    device: {
      id: "string",
      name: "string",
      uuid: "string",
      manufacturer: "string",
      serialNumber: "string",
      station: "string",
      description: "string",
      coordinateSystem: "string",
      nativeName: "string",
      sampleRate: "number",
      sampleInterval: "number",
      iso841Class: "string",
      mtconnectVersion: "string"
    },

    // Samples (kontinuierliche Werte)
    samples: {
      axes: {
        xAxis: {
          position: "number",
          load: "number",
          feedrate: "number",
          feedrateOverride: "number",
          acceleration: "number",
          velocity: "number",
          temperature: "number"
        },
        yAxis: {
          position: "number",
          load: "number",
          feedrate: "number",
          feedrateOverride: "number",
          acceleration: "number",
          velocity: "number",
          temperature: "number"
        },
        zAxis: {
          position: "number",
          load: "number",
          feedrate: "number",
          feedrateOverride: "number",
          acceleration: "number",
          velocity: "number",
          temperature: "number"
        }
      },

      spindle: {
        speed: "number",
        load: "number",
        speedOverride: "number",
        temperature: "number",
        torque: "number",
        power: "number"
      },

      program: {
        name: "string",
        header: "string",
        location: "string",
        comment: "string"
      },

      tool: {
        number: "number",
        group: "number",
        suffix: "string",
        offsetLength: "number",
        offsetRadius: "number",
        functionalLength: "number",
        cuttingDiameter: "number",
        cornerRadius: "number",
        toolLife: "number",
        toolLifeDirection: "string",
        programToolGroup: "number",
        programToolNumber: "number"
      },

      coolant: {
        level: "number",
        temperature: "number",
        concentration: "number",
        pressure: "number",
        flow: "number"
      },

      electrical: {
        voltage: "number",
        current: "number",
        power: "number",
        frequency: "number",
        powerFactor: "number",
        energy: "number"
      },

      time: {
        programTime: "number",
        automaticTime: "number",
        cuttingTime: "number",
        operatingTime: "number",
        poweredTime: "number",
        delay: "number"
      }
    },

    // Events (Ereignisse mit Zuständen)
    events: {
      availability: {
        value: "string", // AVAILABLE, UNAVAILABLE
        timestamp: "ISO8601",
        sequence: "number"
      },
      execution: {
        value: "string", // READY, ACTIVE, INTERRUPTED, STOPPED
        timestamp: "ISO8601",
        sequence: "number"
      },
      controllerMode: {
        value: "string", // AUTOMATIC, MANUAL, SEMI_AUTOMATIC
        timestamp: "ISO8601",
        sequence: "number"
      },
      doorState: {
        value: "string", // OPEN, CLOSED, UNLATCHED
        timestamp: "ISO8601",
        sequence: "number"
      },
      programState: {
        value: "string", // ACTIVE, READY, STOPPED, COMPLETED
        timestamp: "ISO8601",
        sequence: "number"
      }
    },

    // Conditions (Bedingungen/Alarme)
    conditions: {
      normal: {
        level: "NORMAL",
        type: "string",
        text: "string",
        timestamp: "ISO8601",
        sequence: "number",
        nativeCode: "string",
        nativeSeverity: "string",
        qualifier: "string"
      },
      warning: {
        level: "WARNING",
        type: "string",
        text: "string",
        timestamp: "ISO8601",
        sequence: "number",
        nativeCode: "string",
        nativeSeverity: "string",
        qualifier: "string"
      },
      fault: {
        level: "FAULT",
        type: "string",
        text: "string",
        timestamp: "ISO8601",
        sequence: "number",
        nativeCode: "string",
        nativeSeverity: "string",
        qualifier: "string"
      }
    },

    // Assets (Werkzeuge und Ressourcen)
    assets: {
      cuttingTools: {
        toolId: "string",
        toolLifeCycle: "string", // NEW, AVAILABLE, UNAVAILABLE, etc.
        toolLife: {
          type: "string", // MINUTES, PART_COUNT, WEAR
          countDirection: "string", // UP, DOWN
          initial: "number",
          limit: "number",
          value: "number",
          timestamp: "ISO8601"
        },
        measurements: {
          functionalLength: "number",
          cuttingDiameter: "number",
          cornerRadius: "number",
          overallLength: "number",
          shankDiameter: "number",
          shankLength: "number"
        }
      }
    },

    // OPC UA spezifische Felder
    opcua: {
      nodeId: "string",
      namespace: "string",
      browseName: "string",
      displayName: "string",
      dataType: "string",
      accessLevel: "string",
      valueRank: "number",
      minimumSamplingInterval: "number",
      historizing: "boolean"
    },

    // Timestamps
    timestamps: {
      deviceTimestamp: "ISO8601",
      sourceTimestamp: "ISO8601",
      serverTimestamp: "ISO8601"
    },

    // Qualitätsindikatoren
    quality: {
      statusCode: "string",
      additionalInfo: "string"
    }
  };

  // Validierungsfunktion für eingehende Daten
  function validateMachineData(data) {
    // Basis-Validierung
    if (!data || typeof data !== 'object') {
      return false;
    }
    
    // Prüfe ob wichtige Bereiche vorhanden sind
    const requiredSections = ['device', 'samples', 'events'];
    return requiredSections.every(section => data.hasOwnProperty(section));
  }

  // Funktion zur Datenverarbeitung
  function processMachineData(rawData) {
    try {
      // Validiere die Daten
      if (!validateMachineData(rawData)) {
        console.warn('Ungültige Maschinendaten empfangen');
        return null;
      }

      // Erstelle strukturierte Daten basierend auf der Spezifikation
      const processedData = {
        header: rawData.header || {},
        device: rawData.device || {},
        samples: {
          axes: rawData.samples?.axes || {},
          spindle: rawData.samples?.spindle || {},
          program: rawData.samples?.program || {},
          tool: rawData.samples?.tool || {},
          coolant: rawData.samples?.coolant || {},
          electrical: rawData.samples?.electrical || {},
          time: rawData.samples?.time || {}
        },
        events: rawData.events || {},
        conditions: rawData.conditions || {},
        assets: rawData.assets || {},
        opcua: rawData.opcua || {},
        timestamps: rawData.timestamps || {
          deviceTimestamp: new Date().toISOString(),
          sourceTimestamp: new Date().toISOString(),
          serverTimestamp: new Date().toISOString()
        },
        quality: rawData.quality || { statusCode: "Good" }
      };

      return processedData;
    } catch (error) {
      console.error('Fehler bei der Verarbeitung der Maschinendaten:', error);
      return null;
    }
  }

  // MQTT Client Setup (Beispiel mit Paho MQTT)
  let mqttClient = null;
  
  try {
    // MQTT Client initialisieren
    mqttClient = new Paho.MQTT.Client("your-mqtt-broker.com", 8083, "client-" + Math.random());
    
    // Callback für eingehende Nachrichten
    mqttClient.onMessageArrived = async function(message) { //async function?
      try {
        const topic = message.destinationName;
        const payload = message.payloadString;
        
        console.log(`Nachricht empfangen von Topic: ${topic}`);
        
        // Parse JSON
        const rawData = JSON.parse(payload);
        
        // Verarbeite die Daten mit unserer Struktur
        const processedData = processMachineData(rawData);
        
        if (processedData) {
          // Aktualisiere UI mit den strukturierten Daten
          await updateMachineDisplay(processedData);
        }
        
      } catch (error) {
        console.error('Fehler beim Verarbeiten der MQTT-Nachricht:', error);
      }
    };

    // Verbindung herstellen
    await new Promise((resolve, reject) => {
      mqttClient.connect({
        onSuccess: resolve,
        onFailure: reject,
        useSSL: true,
        userName: "your-username",
        password: "your-password"
      });
    });

    // Topics abonnieren
    const topics = [
      "machinetool/+/samples",
      "machinetool/+/events", 
      "machinetool/+/conditions",
      "machinetool/+/assets"
    ];

    for (const topic of topics) {
      mqttClient.subscribe(topic);
      console.log(`Abonniert: ${topic}`);
    }

  } catch (error) {
    console.error('MQTT Verbindungsfehler:', error);
  }

  // UI Update Funktion
  async function updateMachineDisplay(machineData) {
    try {
      // Geräte-Informationen aktualisieren
      if (machineData.device) {
        document.getElementById('machine-name').textContent = machineData.device.name || 'Unbekannt';
        document.getElementById('machine-status').textContent = machineData.events?.availability?.value || 'Unbekannt';
      }

      // Achsen-Daten aktualisieren
      if (machineData.samples?.axes) {
        const axes = machineData.samples.axes;
        
        if (axes.xAxis) {
          document.getElementById('x-position').textContent = axes.xAxis.position?.toFixed(2) || '0.00';
          document.getElementById('x-load').textContent = axes.xAxis.load?.toFixed(1) || '0.0';
        }
        
        if (axes.yAxis) {
          document.getElementById('y-position').textContent = axes.yAxis.position?.toFixed(2) || '0.00';
          document.getElementById('y-load').textContent = axes.yAxis.load?.toFixed(1) || '0.0';
        }
        
        if (axes.zAxis) {
          document.getElementById('z-position').textContent = axes.zAxis.position?.toFixed(2) || '0.00';
          document.getElementById('z-load').textContent = axes.zAxis.load?.toFixed(1) || '0.0';
        }
      }

      // Spindel-Daten aktualisieren
      if (machineData.samples?.spindle) {
        const spindle = machineData.samples.spindle;
        document.getElementById('spindle-speed').textContent = spindle.speed || '0';
        document.getElementById('spindle-load').textContent = spindle.load?.toFixed(1) || '0.0';
        document.getElementById('spindle-temperature').textContent = spindle.temperature?.toFixed(1) || '0.0';
      }

      // Werkzeug-Daten aktualisieren
      if (machineData.samples?.tool) {
        const tool = machineData.samples.tool;
        document.getElementById('tool-number').textContent = tool.number || '0';
        document.getElementById('tool-life').textContent = tool.toolLife?.toFixed(1) || '0.0';
      }

      // Programm-Informationen aktualisieren
      if (machineData.samples?.program) {
        const program = machineData.samples.program;
        document.getElementById('program-name').textContent = program.name || 'Kein Programm';
      }

      // Alarme/Conditions anzeigen
      if (machineData.conditions) {
        const conditionsContainer = document.getElementById('conditions-list');
        conditionsContainer.innerHTML = '';

        // Durchlaufe alle Conditions
        Object.entries(machineData.conditions).forEach(([key, condition]) => {
          if (condition.level !== 'NORMAL') {
            const conditionElement = document.createElement('div');
            conditionElement.className = `condition ${condition.level.toLowerCase()}`;
            conditionElement.innerHTML = `
              <span class="level">${condition.level}</span>
              <span class="text">${condition.text}</span>
              <span class="time">${new Date(condition.timestamp).toLocaleTimeString()}</span>
            `;
            conditionsContainer.appendChild(conditionElement);
          }
        });
      }

      // Letzte Aktualisierung anzeigen
      document.getElementById('last-update').textContent = new Date().toLocaleTimeString();

    } catch (error) {
      console.error('Fehler beim Aktualisieren der Anzeige:', error);
    }
  }

  // Hilfsfunktion für Datenextraktion
  function extractSpecificData(machineData, path) {
    return path.split('.').reduce((obj, key) => obj?.[key], machineData);
  }

  // Beispiel für spezifische Datenabfrage
  function getMachineStatus(machineData) {
    return {
      isAvailable: extractSpecificData(machineData, 'events.availability.value') === 'AVAILABLE',
      isRunning: extractSpecificData(machineData, 'events.execution.value') === 'ACTIVE',
      currentProgram: extractSpecificData(machineData, 'samples.program.name'),
      activeTool: extractSpecificData(machineData, 'samples.tool.number'),
      spindleSpeed: extractSpecificData(machineData, 'samples.spindle.speed'),
      machineLoad: {
        x: extractSpecificData(machineData, 'samples.axes.xAxis.load'),
        y: extractSpecificData(machineData, 'samples.axes.yAxis.load'),
        z: extractSpecificData(machineData, 'samples.axes.zAxis.load')
      }
    };
  }

  // Periodische Statusabfrage (optional)
  setInterval(() => {
    // Hier können Sie periodische Aktionen ausführen
    console.log('Periodische Statusprüfung...');
  }, 30000); // Alle 30 Sekunden

  // Cleanup bei Seiten-Unload
  window.addEventListener('beforeunload', () => {
    if (mqttClient && mqttClient.isConnected()) {
      mqttClient.disconnect();
    }
  });

  console.log('Machine Tool Data Handler initialisiert');

})().catch(error => {
  console.error('Fehler beim Initialisieren des Machine Tool Data Handlers:', error);
});

// Alternative: Als separates Modul laden
// Falls Sie die Struktur aus einer separaten Datei laden möchten:

/*
// machine-tool-structure.js als separate Datei
const MachineToolStructure = { ... }; // Die komplette Struktur
window.MachineToolStructure = MachineToolStructure;

// In Ihrem Haupt-Script:
(async function() {
  // Lade externe Struktur
  const script = document.createElement('script');
  script.src = 'machine-tool-structure.js';
  document.head.appendChild(script);
  
  await new Promise(resolve => {
    script.onload = resolve;
  });
  
  // Jetzt ist window.MachineToolStructure verfügbar
  const structure = window.MachineToolStructure;
  
  // Ihr restlicher Code...
})();
*/