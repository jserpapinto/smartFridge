import muthesius.net.*;
import org.webbitserver.*;

WebSocketP5 socket;
PFont font, fontS;
String msg, lastMsg, returnMsg, newP;
ArrayList<clsUser> lstUserProducts;
ArrayList<clsProduct> lstProducts;
ArrayList<clsUser> lstUsers;
int state, currentP, currentU;

void setup() {
  socket = new WebSocketP5(this, 9090, "supersmart");

  size(634, 1000);
  stroke(32);
  rectMode(CENTER);
  background(128);
  strokeWeight(4);
  line(0, height/3, width, height/3);
  strokeWeight(1);

  font = createFont("arial32.vlw", 32);
  fontS = createFont("arial48.vlw", 48);
  textAlign(CENTER);
  textFont(font);

  state = 0;
  currentP = currentU = -1;
  msg = lastMsg = returnMsg = newP ="";
  LoadProducts("productsList");
  LoadUsers();
  frameRate(20);
  //LoadUsersAndProducts("data");
}

void draw() {
  if (lastMsg != msg) {
    println(msg);
    lastMsg = msg;  
    if (currentU >= 0) {
      switch (state) {
      case 1:
        RemoveProduct(msg);
        break;
      case 2:
        RemoveProductQuantity(msg);
        break;
      case 3:
        InsertProduct(msg);
        break;
      case 4:
        if (msg.charAt(0) == '*')Print(msg);
        else InsertProductQuantity(msg);
        break;
      default:
        Commands(msg);
        Print(msg);
        LoginCheck(msg);
      }
    } else LoginCheck(msg);
  }
}

void CleanUp() {
  fill(128);
  rect(width/2, height/6 + 1, width, height/3 - 2);
}

void CleanDown() {
  fill(128);
  rect(width/2, 4*height/6 + 1, width, 2*height/3 - 2);
}

public void LoadProducts(String filename) {
  lstProducts = new ArrayList<clsProduct>(); 
  String list[];
  list = loadStrings(filename + ".csv");
  for (int i = 0; i < list.length; i++) {
    String row[] = list[i].split(",");
    lstProducts.add(new clsProduct(row[0], int(row[1])));
  }
}

public void LoadUsers() {
  lstUsers = new ArrayList<clsUser>();
  lstUsers.add(new clsUser(color(255, 255, 0), "john"));
  lstUsers.add(new clsUser(color(0, 0, 255), "tiago"));
  lstUsers.add(new clsUser(color(255, 56, 152), "bruno"));
  //lstColors.add(new clsColor(color(0, 255, 0), "green"));
  //lstColors.add(new clsColor(color(0, 0, 255), "blue"));
}

public void LoadUsersAndProducts() {
  JSONArray values = loadJSONArray("data.json");
  lstUserProducts = new ArrayList<clsUser>();
}