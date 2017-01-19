public class clsProduct {
 
  public String pName;
  public int quantity;
  
  public clsProduct(String name, int qtt) {
    pName = name;
    quantity = qtt;
  }
}

public class clsUser {
 
  public ArrayList<clsProduct> products;
  public color colour;
  public String user;
  
  clsUser(color col, String userName) {
    colour = col;
    user = userName;
  }
}