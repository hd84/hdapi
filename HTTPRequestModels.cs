
  using System;
  
          [Serializable]
          public class auth_finduser_Request
          {
    public string type;	// default value : db
    public int ch;	//channel 0:GUEST, 1:APPLE, 2:GOOGLE;
    public string cid;	//cid;
    public string deviceid;	//deviceid;
}
          [Serializable]
          public class auth_gamelogin_Request
          {
    public string type;	// default value : db
    public string uniqueid;	//deviceid;
}
          [Serializable]
          public class user_userinfo_Request
          {
    public string type;	// default value : db
    public int uid;	//uid;
}
          [Serializable]
          public class user_cards_Request
          {
    public string type;	// default value : db
    public string session;	//user session;
    public int uid;	//user id;
}
          [Serializable]
          public class user_characters_Request
          {
    public string type;	// default value : db
    public string session;	//user session;
    public int uid;	//user id;
}
          [Serializable]
          public class common_notice_Request
          {
    public string type;	// default value : db
}
          [Serializable]
          public class common_packetjson_Request
          {
    public string type;	// default value : db
}
          [Serializable]
          public class servertime_Request
          {
    public string type;	// default value : db
    public int userid;	//user id;
}
          [Serializable]
          public class jsonload_Request
          {
    public string type;	// default value : db
    public string filename;	//json file name;
}