class Definer {
  //***GENERAL ERRORS */
  static general_err1 = "smth went wrong!";
  static general_err2 = "there is no data with that parametres!";
  static general_err3 = "file upload errror!";

  /**member auth related ********/

  static auth_err1 = "mongodb validation is failed";
  static auth_err2 = "jwt token creation error";
  static auth_err3 = "no member with that mb_nick";
  static auth_err4 = "Your credentials does not match";
  static auth_err5 = "You are not authenticated";
  /**product related ********/

  static product_err1 = "product creation is failed!";

  //orders related error

  static order_err1 = "order creation is failed";
  static order_err2 = "order item creation is failed";
  static order_err3 = "no data with that params exists";

  //articles related error
  static article_err1 = "author member for articlesnot provided";
  static article_err2 = "no article found with that member";
  static article_err3 = "no article found with that target";

  //follow related error
  static follow_err1 = "self subscribtion is denied";
  static follow_err2 = "new follow subscribtion failed";
  static follow_err3 = "no follow data found";
}
module.exports = Definer;
