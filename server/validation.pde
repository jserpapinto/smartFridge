void Commands (String msg) {
  if (msg.equals("list")) {
    sendOK();
    List();
  } else if (msg.equals("remove")) state = 1;
  else if (msg.equals("insert")) state = 3;
}

void Print(String msg) {
  CleanUp();
  textFont(fontS);
  fill(lstUsers.get(currentU).colour);
  if (msg.charAt(0) == '*') {
    msg = msg.substring(1, msg.length());
    String[] message = split(msg, ' ');
    String[] lines = new String[message.length/3 + 1];
    for (int i = 0; i < lines.length; i++) lines[i] = "";
    for (int i = 0; i < message.length; i++) lines[i/3] += message[i] + " ";
    for (int i = 0; i < lines.length; i++) text(lines[i].trim(), width/2, height/3/(lines.length + 1)*(i + 1));
  }
  textFont(font);
}

//void ColorCheck(String msg) { for (int i = 0; i < lstColors.size(); i++) if (msg.equals(lstColors.get(i).cName)) currentC = lstColors.get(i).colour; }

void LoginCheck(String msg) {
  if (msg.contains("login")) {
    for (int i = 0; i < lstUsers.size(); i++) if (msg.contains(lstUsers.get(i).user)) currentU = i;
    if (currentU >= 0) {
      send(lstUsers.get(currentU).user.toString());
      List();
    } else sendNull();
  }
}

void List() {
  CleanDown();
  fill(lstUsers.get(currentU).colour);
  for (int i = 0; i < lstProducts.size(); i++) {
    text(lstProducts.get(i).pName + " - " + lstProducts.get(i).quantity, width/2, 2*height/3/(lstProducts.size() + 1)*(i + 1)+height/3);
  }
}

void RemoveProduct(String msg) {
  for (int i = 0; i < lstProducts.size(); i++) if (msg.equals(lstProducts.get(i).pName)) currentP = i;
  if (currentP >= 0) {
    state = 2;
    sendOK();
  } else {
    sendNull(); 
    state = 0;
  }
}

void RemoveProductQuantity(String msg) {
  int qtt = int(msg);
  if (lstProducts.get(currentP).quantity > qtt) {
    lstProducts.get(currentP).quantity -= qtt;
    send("Removing " + lstProducts.get(currentP).pName);
    List();
  } else send("There aren't " + lstProducts.get(currentP).pName + "s enough!");
  currentP = -1;
  state = 0;
}

void InsertProduct(String msg) { 
  for (int i = 0; i < lstProducts.size(); i++) if (msg.equals(lstProducts.get(i).pName)) currentP = i;
  if (currentP == -1) newP = msg;
  sendOK();
  state = 4;
}

void InsertProductQuantity(String msg) {
  if (currentP >= 0) lstProducts.get(currentP).quantity += int(msg);
  else lstProducts.add(new clsProduct(newP, int(msg)));
  newP = "";
  currentP = -1;
  List();
  state = 0;
  sendOK();
}