var word9 = function() {
  function random(nn) {
    return (Math.floor(Math.random() * nn) % nn);
  }


  var i, j, n = -1,
    m = -1,
    o = -1,
    IsLoading = false,
    StartTime, EndTime, IsOver, IsRepeat;
  var WL = WordList.split(" ");
  var nWord = 0
  var TWord, CWord, Word = new Array();
  for (i = 0; i < WL.length; i++) {
    if (WL[i].length == 9)
      Word[nWord++] = WL[i];
  }
  var Grid = new Array(3);
  for (i = 0; i < 3; i++)
    Grid[i] = new Array(3);
  var Alphabet = " abcdefghijklmnopqrstuvwxyz";
  Pic = new Array(27);
  Pic[0] = new Image();
  Pic[0].src = "img/9word/xword__.gif";
  for (n = 1; n < 27; n++) {
    Pic[n] = new Image();
    Pic[n].src = "img/9word/xword_" + Alphabet.charAt(n) + ".gif";
  }
  Pic[27] = new Image();
  Pic[27].src = "img/9word/xword_0.gif";
  Path = new Array(13);
  Path[0] = new Array(0, 1, 2, 5, 4, 3, 6, 7, 8);
  Path[1] = new Array(0, 3, 6, 7, 4, 1, 2, 5, 8);
  Path[2] = new Array(2, 1, 0, 3, 4, 5, 8, 7, 6);
  Path[3] = new Array(2, 5, 8, 7, 4, 1, 0, 3, 6);
  Path[4] = new Array(0, 1, 2, 5, 8, 7, 4, 3, 6);
  Path[5] = new Array(0, 3, 6, 7, 8, 5, 4, 1, 2);
  Path[6] = new Array(2, 1, 0, 3, 6, 7, 4, 5, 8);
  Path[7] = new Array(2, 5, 8, 7, 6, 3, 4, 1, 0);
  Path[8] = new Array(0, 1, 2, 5, 8, 7, 6, 3, 4);
  Path[9] = new Array(0, 3, 6, 7, 8, 5, 2, 1, 4);
  Path[10] = new Array(2, 1, 0, 3, 6, 7, 8, 5, 4);
  Path[11] = new Array(2, 5, 8, 7, 6, 3, 0, 1, 4);
  Path[12] = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8);

  function WordInit(isNew) {
    var ii, jj, nn, mm;
    if (isNew) {
      nn = o;
      while (nn == o) o = random(nWord);
      CWord = Word[o];
      if (false && document.OptionsForm.hard.checked) {
        for (nn = 0; nn < 108; nn++) {
          ii = random(9);
          jj = random(9);
          mm = Path[12][ii];
          Path[12][ii] = Path[12][jj];
          Path[12][jj] = mm;
        }
        n = 12;
      } else {
        m = n;
        while (m == n) n = random(12);
      }
      m = random(2);
      IsRepeat = false;
    } else IsRepeat = true;
    Now = new Date();
    StartTime = Now.getTime() / 1000;
    if (m == 0) {
      for (mm = 0; mm < 9; mm++) {
        ii = Path[n][mm] % 3;
        jj = (Path[n][mm] - ii) / 3;
        Grid[ii][jj] = CWord.charAt(mm);
      }
    } else {
      for (mm = 0; mm < 9; mm++) {
        ii = Path[n][mm] % 3;
        jj = (Path[n][mm] - ii) / 3;
        Grid[2 - ii][2 - jj] = CWord.charAt(mm);
      }
    }
    for (ii = 0; ii < 3; ii++) {
      for (jj = 0; jj < 3; jj++)
        document.images[3 * ii + jj].src = "img/9word/xword_" + Grid[ii][jj].toLowerCase() + ".gif";
    }
    TWord = "";
    document.OptionsForm.CurWord.value = TWord;
  }

  $('#newGameButton').on('click', function() {
    WordInit(1);
  });

  $('#repeatGameButton').on('click', function() {
    WordInit(0);
  });

  $('#showGameButton').on('click', function() {
    Show();
  });

  $('#helpGameButton').on('click', function() {
    Help();
  });

  $(document).on('click', '.charDispSet', function() {
    Clicked($(this).data('val_n'), $(this).data('val_m'));
  });

  function Show() {
    alert("Show is not solve!")
    document.OptionsForm.CurWord.value = CWord;
  }

  function Clicked(ii, jj) {
    if (Grid[ii][jj] == "_") return;
    TWord += Grid[ii][jj];
    Grid[ii][jj] = "_";
    document.images[3 * ii + jj].src = "img/9word/xword__.gif";
    document.OptionsForm.CurWord.value = TWord;
    if (TWord != CWord) return;
    Now = new Date();
    EndTime = Now.getTime() / 1000;
    var dd = Math.floor(EndTime - StartTime);
    if (!IsRepeat) {
      if (window.opener) {
        if (window.opener.SetHighscores) {
          if (document.OptionsForm.hard.checked) window.opener.SetHighscores("9Word", "Hard", ii, -1);
          else window.opener.SetHighscores("9Word", "Easy", ii, -1);
        }
      }
    }
    if (confirm("Super, you solved this game in " + dd + " seconds!\nPlay again?")) WordInit(1);
  }

  function Help() {
    alert("Find the 9-letter-word which is hidden in the grid!\nGood luck!")
  }

  var elem = "<table border=2 cellpadding=2 cellspacing=2 bgcolor=#FFFFCC><tr><td>";
  for (n = 0; n < 3; n++) {
    elem += "<NOBR>";
    for (m = 0; m < 3; m++)
      elem += "<IMG class='charDispSet' data-val_n='" + n + "' data-val_m='" + m + "' src='" + Pic[0].src + "' border=0>";
    elem += "</NOBR><BR>";
  }
  elem += "</td></tr>";
  elem += '<table border="2" cellpadding="2" cellspacing="2" bgcolor="#FFFFCC"><tbody>' +
    '<tr><td colspan="3" align="center"><input name="CurWord" value="" style="width:90" size="11" readonly=""></td></tr>' +
    '</tbody></table>';
  $('.wordSetHolder').append(elem);

  WordInit(1);
}