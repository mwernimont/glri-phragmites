package gov.usgs;

public class SQLInjectionTest {

  public static boolean testInteger(String i) {
    try {
      Integer.parseInt(i);
    } catch (Exception e) {
      return false;
    }
    return true;
  }

  public static boolean testDouble(String d) {
    try {
      Double.parseDouble(d);
    } catch (Exception e) {
      return false;
    }
    return true;    
  }
  
  
  public static boolean testFloat(String f) {
    try {
      Float.parseFloat(f);
    } catch (Exception e) {
      return false;
    }
    return true;    
  }
  
  
  public static boolean testBBox(String bbox) {
    try {
      String[] bounds = bbox.split(",");
      if (bounds.length != 4) {
        return false;
      } else {
        for (int i = 0; i < 4; i++) {
          Double.parseDouble(bounds[i]);
        }
      }
    } catch (Exception e) {
      return false;
    }    
    return true;
  }

  public static boolean testNoSpaces(String s) {  
    if (s.indexOf(" ")  == -1) {
      return true;
    }
    return false;  
  }

}
