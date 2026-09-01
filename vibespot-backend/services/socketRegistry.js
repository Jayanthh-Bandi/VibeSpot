const connectedSockets = new Map();

/*
Map Structure

userId
   ↓
socket

Example

{
   "24561496-xxxx" => socket
}
*/

export const registerSocket = (socket) => {
  connectedSockets.set(socket.user.id, socket);

};

export const removeSocket = (socket) => {
  connectedSockets.delete(socket.user.id);
};

export const getSocketByUserId = (userId) => {

    return connectedSockets.get(userId);

};