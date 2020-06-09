async function discord<T>(message: T[]): Promise<void> {
  const url: string = PropertiesService.getScriptProperties().getProperty(
    "WEB_HOOK"
  );

  for (let i = 0; i < message.length; i = (i + 1) | 0) {
    //テキストを生成
    const description: string = generate_description<string>(message[i][1]);

    //OGP画像生成
    const ogp_url: string = await imgur<string>(
      encodeURIComponent(
        message[i][0].replace(/\,/g, "%2C").replace(/\//g, "%2F")
      )
    );

    //author_iconを設定
    const icon_url: string = message[i][2]
      .replace(/<img src="/, "")
      .replace(/" referrerpolicy="no-referrer">/, "");

    //json本体
    const json = {
      attachments: [
        {
          fallback: message[i][0],
          color: "#004194",
          title: message[i][0],
          title_link: message[i][1],
          author_name: "京都造形芸術大学 在学生専用サイト",
          author_link: "https://www.kyoto-art.ac.jp/student/",
          author_icon: icon_url,
          text: description,
          image_url: ogp_url
        }
      ]
    };

    //json本体をJSON形式に変換
    const payload: string = JSON.stringify(json);

    //変換したJSONをヘッダー情報に格納
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      contentType: "application/json",
      payload: payload
    };

    //Discordのwebhookにヘッダー情報をPOSTした後1秒間sleep(連投対策)
    UrlFetchApp.fetch(url, options);
    Utilities.sleep(1000);
  }
}
