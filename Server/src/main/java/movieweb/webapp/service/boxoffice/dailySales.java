package movieweb.webapp.service.boxoffice;

import java.io.BufferedInputStream;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;
import org.springframework.beans.factory.annotation.Value;

// BufferedInputStream w = new BufferedInputStream;
public class dailySales implements RankSales{
    @Value("${java.file.kobis.key}")
    String Key;

    @Override
    public JSONArray getDailySales() {
        return null;
    }

    public JSONArray dailySales() throws Exception {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String formatedToday = today.format(formatter);
        JSONParser jsonparser = new JSONParser();
        JSONObject jsonobject = (JSONObject)jsonparser.parse(readUrl(formatedToday, Key));
        JSONObject json = (JSONObject)jsonobject.get("boxOfficeResult");
        JSONArray array = (JSONArray)json.get("dailyBoxOfficeList");
        for(int i = 0; i < array.size(); i++) {
            JSONObject entity = (JSONObject)array.get(i);
            String movieNm = (String) entity.get("movieNm");
            System.out.println(i+1 + "위 - " + movieNm);
        }
        return array;
    }
    private static String readUrl(String today, String Key) throws Exception {
        
        BufferedInputStream reader = null;
        try {
            URL url = new URL(
                "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/"
                + "searchDailyBoxOfficeList.json"
                + "?key=" + Key
                + "&targetDt=" + today);
            reader = new BufferedInputStream(url.openStream());
            StringBuffer buffer = new StringBuffer();
            int i;
            byte[] b = new byte[8192];
            while( (i= reader.read(b)) != -1) {
                buffer.append(new String(b, 0, i));
            }
             System.out.println(buffer.toString());
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
