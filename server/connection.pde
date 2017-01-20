void stop() {
  socket.stop();
}

void websocketOnMessage(WebSocketConnection con, String message) {
  msg = message;
}

void websocketOnOpen(WebSocketConnection con) {
  println("A client joined");
}

void websocketOnClosed(WebSocketConnection con) {
  println("A client left");
}

void sendNull() {
  println("SENDING ?");
  socket.broadcast("?");
}

void send(String msg) {
  println("SENDING " + msg);
  socket.broadcast(msg);
}

void sendOK() {
  println("SENDING OK");
  socket.broadcast("OK");
}