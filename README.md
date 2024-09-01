# Baileys

Este es un repositorio modificado de Baileys, originalmente clonado del repositorio oficial de [@WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys). Si bien no se realizó un fork directo, este repositorio incluye cambios y mejoras que he implementado para personalizar y optimizar su uso.

## Características de esta versión

- **Soporte para Newsletter**
- **Corrección de Errores**
- **Eliminación de Mensajes Innecesarios**

## Instalación

Puedes instalar esta versión de Baileys desde npm utilizando el siguiente comando:

```bash
npm install al-e-dev/Baileys
```

### Dependencias adicionales

Este repositorio se integra con otro proyecto modificado llamado `libsignal-node`, que también puedes instalar desde npm:

```bash
npm install al-e-dev/libsignal-node
```

## Uso

### Ejemplo básico de conexión.

```javascript
import { makeWASocket } from 'baileys'

async function open() {
    const sock = makeWASocket({
        printQRInTerminal: true,
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldReconnect) {
                open()
            }
        } else if (connection === 'open') {
            console.log('Connected')
        }
    })

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.key.fromMe && m.type === 'notify') {
            await sock.sendMessage(msg.key.remoteJid, { text: 'Hello there!' })
        }
    })
}

open()
```

### Newsletters

#### Actualizar el nombre de una newsletter

```javascript
await updateNewsletter(jid, { name: 'New Newsletter Name' })
```

#### Actualizar la descripción de una newsletter

```javascript
await updateNewsletter(jid, { description: 'New Description' })
```

#### Actualizar la imagen de una newsletter

```javascript
await updateNewsletter(jid, { picture: someWAMediaUpload })
```

#### Eliminar la imagen de una newsletter

```javascript
await updateNewsletter(jid, { picture: '' })
```

#### Actualizar la configuración de reacciones de una newsletter a ```all some none```

```javascript
await updateNewsletter(jid, { reaction: 'all' })
```

#### Silenciar una newsletter

```javascript
await muteNewsletter(jid, 'mute')
```

#### Activar una newsletter

```javascript
await updateNewsletterMuteStatus(jid, 'un_mute')
```


## Contribuciones

Este repositorio está en constante desarrollo, y aunque aún soy un desarrollador en aprendizaje, mi objetivo es seguir mejorándolo. Si tienes sugerencias, correcciones o deseas colaborar, no dudes en hacerlo.

## Agradecimientos

Agradezco al equipo de [@WhiskeySockets](https://github.com/WhiskeySockets) por el trabajo original en Baileys y por brindar una excelente base sobre la cual he podido aprender y construir.