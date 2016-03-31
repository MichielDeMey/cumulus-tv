var Template = function() {

  return `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
      <head>
        <style>
        .showTextOnHighlight {
          tv-labels-state: show-on-highlight;
        }
        </style>
      </head>
      <stackTemplate class="darkBackgroundColor" theme="dark">
        <banner>
          <background>
            <img src="${App.BASEURL}/resources/background.jpg" width="1920" height="360" />
          </background>
        </banner>
        <collectionList>
        </collectionList>
      </stackTemplate>
    </document>`
}