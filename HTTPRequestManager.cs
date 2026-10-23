
  using System.Collections.Generic;
  using UnityEngine;

  public static class HTTPRequestManager
  {
            
          public static Coroutine auth_finduser(int ch, string cid, string deviceid)
          {
    var requestBody = new auth_finduser_Request
    {
        type = "db",
        ch = ch,
        cid = cid,
        deviceid = deviceid,
    };
    return HTTPManager.Instance.PostJson<auth_finduser_Request, Dictionary<string, object>>("auth/finduser", requestBody, null, null);
}
          
          public static Coroutine auth_gamelogin(string uniqueid)
          {
    var requestBody = new auth_gamelogin_Request
    {
        type = "db",
        uniqueid = uniqueid,
    };
    return HTTPManager.Instance.PostJson<auth_gamelogin_Request, Dictionary<string, object>>("auth/gamelogin", requestBody, null, null);
}
          
          public static Coroutine user_userinfo(int uid)
          {
    var requestBody = new user_userinfo_Request
    {
        type = "db",
        uid = uid,
    };
    return HTTPManager.Instance.PostJson<user_userinfo_Request, Dictionary<string, object>>("user/userinfo", requestBody, null, null);
}
          
          public static Coroutine user_cards(string session, int uid)
          {
    var requestBody = new user_cards_Request
    {
        type = "db",
        session = session,
        uid = uid,
    };
    return HTTPManager.Instance.PostJson<user_cards_Request, Dictionary<string, object>>("user/cards", requestBody, null, null);
}
          
          public static Coroutine user_characters(string session, int uid)
          {
    var requestBody = new user_characters_Request
    {
        type = "db",
        session = session,
        uid = uid,
    };
    return HTTPManager.Instance.PostJson<user_characters_Request, Dictionary<string, object>>("user/characters", requestBody, null, null);
}
          
          public static Coroutine common_notice()
          {
    var requestBody = new common_notice_Request
    {
        type = "db",
    };
    return HTTPManager.Instance.PostJson<common_notice_Request, Dictionary<string, object>>("common/notice", requestBody, null, null);
}
          
          public static Coroutine common_packetjson()
          {
    var requestBody = new common_packetjson_Request
    {
        type = "db",
    };
    return HTTPManager.Instance.PostJson<common_packetjson_Request, Dictionary<string, object>>("common/packetjson", requestBody, null, null);
}
          
          public static Coroutine servertime(int userid)
          {
    var requestBody = new servertime_Request
    {
        type = "db",
        userid = userid,
    };
    return HTTPManager.Instance.PostJson<servertime_Request, Dictionary<string, object>>("root/servertime", requestBody, null, null);
}
          
          public static Coroutine jsonload(string filename)
          {
    var requestBody = new jsonload_Request
    {
        type = "db",
        filename = filename,
    };
    return HTTPManager.Instance.PostJson<jsonload_Request, Dictionary<string, object>>("root/jsonload", requestBody, null, null);
}
  }
