
export default class Utils {
    public static getRegex(name: any) {
      const regex: any = {};
      regex.email = new RegExp(/^([\w-\.\+a-z0-9]+@([\w-]+\.)+[\w-]{2,4})?$/);
      regex.phone = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/);
      regex.username = new RegExp(/^(^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$|^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$)$/);
      return regex[name];
    }
}  