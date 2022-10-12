package seospringtest.dailySales;

import java.io.BufferedInputStream;
import java.net.URL;

import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;
// BufferedInputStream w = new BufferedInputStream;
public class dailySales {
    public dailySales() throws Exception {
        JSONParser jsonparser = new JSONParser();
        JSONObject jsonobject = (JSONObject)jsonparser.parse(readUrl());
        JSONObject json = (JSONObject)jsonobject.get("boxOfficeResult");
        JSONArray array = (JSONArray)json.get("dailyBoxOfficeList");
        for(int i = 0; i < array.size(); i++) {
            JSONObject entity = (JSONObject)array.get(i);
            String movieNm = (String) entity.get("movieNm");
            System.out.println(i+1 + "위 - " + movieNm);
        }
    }
    private static String readUrl() throws Exception {
        BufferedInputStream reader = null;
        try {
            URL url = new URL(
                "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/"
                + "searchDailyBoxOfficeList.json"
                + "?key=b468420905744f639536c8d12b730291"
                + "&targetDt=20150101");
            reader = new BufferedInputStream(url.openStream());
            StringBuffer buffer = new StringBuffer();
            int i;
            byte[] b =new byte[8192];
            while( (i= reader.read(b)) != -1) {
                buffer.append(new String(b, 0, i));
            }
            // System.out.println(buffer.toString());
            return buffer.toString();
        }
        finally {
            if (reader != null) {
                reader.close();
            }
        }
    }

    public static void main(String[] args) {
        try {
            System.out.println("go");
            new dailySales();
            System.out.println("done");
        }
        catch (Exception e) {
            e.printStackTrace();
            System.out.println("fail");
        }
    }
}
