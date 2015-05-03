var othello = function(){
    var i, j, val, best_i, best_j, IsOver, size_d_2, size, Start0;

    var Move, MoveCount, MaxMoveCount, MoveVal, Blink;
    IsPlayer = new Array(2);
    IsPlayer[0] = 1;
    IsPlayer[1] = 0;
    Level = new Array(2);
    Level[0] = 1;
    Level[1] = 2;
    Start0 = 1;
    size_d_2 = 4;
    size = 2 * size_d_2;
    History = new Array(size * size);

    for (i = 0; i < size * size; i++)
        History[i] = new Array(11);
    Fld = new Array(size);

    for (i = 0; i < size; i++) {
        Fld[i] = new Array(size);
    }

    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            Fld[i][j] = new Array(4);
        }
    }

    FVal = new Array(size);
    for (i = 0; i < size; i++) {
        FVal[i] = new Array(size);
    }

    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++)
            FVal[i][j] = 5;
    }

    for (i = 0; i < size; i++) {
        FVal[i][0] += 20;
        FVal[i][size - 1] += 20;
        FVal[0][i] += 20;
        FVal[size - 1][i] += 20;
    }
    for (i = 0; i < size; i++) {
        FVal[i][1] -= 15;
        FVal[i][size - 2] -= 15;
        FVal[1][i] -= 15;
        FVal[size - 2][i] -= 15;
    }
    for (i = 0; i < size; i++) {
        FVal[i][2] += 10;
        FVal[i][size - 3] += 10;
        FVal[2][i] += 10;
        FVal[size - 3][i] += 10;
    }
    FVal[0][0] += 80;
    FVal[size - 1][0] += 80;
    FVal[0][size - 1] += 80;
    FVal[size - 1][size - 1] += 80;
    FVal[1][1] -= 40;
    FVal[size - 2][1] -= 40;
    FVal[1][size - 2] -= 40;
    FVal[size - 2][size - 2] -= 40;

    Pic = new Array(5);
    for (i = 0; i < 5; i++) {
        Pic[i] = new Image();
        Pic[i].src = "img/othello/reversi" + i + ".gif";
    }

    for (var i = 0; i < size; i++) {
        var elem = "<tr align=center bgcolor=#008800 id='row"+i+"'>";
        $('#othello_table').append(elem);
        for (var j = 0; j < size; j++)
            $('#row'+i).append("<td><a class='othello-block' data-block-row='" +i+"' data-block-col='"+j+"'>" +
                "<img src=\"img/othello/reversi0.gif\" border=0></a></td>");
        $('#othello_table').append("</tr>");
    }

    $('.othello-block').click(function(){
        var row = parseInt(this.getAttribute('data-block-row'));
        var col = parseInt(this.getAttribute('data-block-col'));
        Clicked(row,col);
    });

    $('.othello-block').mouseover(function(){
        var row = parseInt(this.getAttribute('data-block-row'));
        var col = parseInt(this.getAttribute('data-block-col'));
        MouseOver(row,col);
    });

    $('.othello-block').mouseout(function(){
        var row = parseInt(this.getAttribute('data-block-row'));
        var col = parseInt(this.getAttribute('data-block-col'));
        MouseOut(row,col);
    });

    $('#new_button').click(function(){
        Init();
    });
    $('#help_button').click(function(){
       Help();
    });

    function Init() {
        var ii, jj;
        Move = 1 - Start0;
        for (ii = 0; ii < size; ii++) {
            for (jj = 0; jj < size; jj++)
                Fld[ii][jj][0] = -1;
        }
        Fld[size_d_2][size_d_2][0] = 0;
        Fld[size_d_2 - 1][size_d_2 - 1][0] = 0;
        Fld[size_d_2][size_d_2 - 1][0] = 1;
        Fld[size_d_2 - 1][size_d_2][0] = 1;
        IsOver = false;
        MoveCount = 0;
        MaxMoveCount = 0;
        Blink = 0;
        RefreshScreen();
    }

    function SetOption(nn, mm) {
        if (nn < 2) IsPlayer[nn] = mm;
        else Start0 = mm;
    }

    function SetLevel(nn, mm) {
        Level[nn] = mm;
    }

    function Back() {
        if (Blink > 0) return;
        if (MoveCount > 0) {
            IsOver = false;
            MoveCount--;
            var ii = History[MoveCount][0];
            var jj = History[MoveCount][1];
            hh = new Array(9);
            var ddx, ddy, nn;
            for (nn = 0; nn < 9; nn++)
                hh[nn] = History[MoveCount][nn + 2];
            Move = hh[4];
            hh[4] = 0;
            nn = -1;
            for (ddx = -1; ddx <= 1; ddx++) {
                for (ddy = -1; ddy <= 1; ddy++) {
                    nn++;
                    hh[nn]--;
                    while (hh[nn] > 0) {
                        Fld[ii + hh[nn] * ddx][jj + hh[nn] * ddy][0] = 1 - Fld[ii][jj][0];
                        hh[nn]--;
                    }
                }
            }
            Fld[ii][jj][0] = -1;
            RefreshScreen();
        }
    }

    function Replay() {
        if (Blink > 0) return;
        if (MoveCount < MaxMoveCount) {
            var ii = History[MoveCount][0];
            var jj = History[MoveCount][1];
            MakeRealMove(ii, jj);
            RefreshScreen();
        }
    }

    function MakeBestMove(nn, ll) {
        var ii, jj, rr = nn + 1,
            act_val, best_val = -10000,
            nvalid = 0;
        MoveVal = 1;
        if (MoveCount > 40) MoveVal = MoveCount - 40;
        for (ii = 0; ii < size; ii++) {
            for (jj = 0; jj < size; jj++) {
                if (MakeVirtualMove(ii, jj, rr) > 0) {
                    nvalid++;
                    act_val = (5 + rr) * (val + FVal[ii][jj] + MoveVal);
                    if (rr < ll) {
                        Move = 1 - Move;
                        act_val -= MakeBestMove(rr, ll);
                        Move = 1 - Move;
                    }
                    if (rr == 1)
                        act_val += Math.round(Math.random() * 1000) % size;
                    if (best_val < act_val) {
                        best_val = act_val;
                        if (rr == 1) {
                            best_i = ii;
                            best_j = jj;
                        }
                    }
                }
            }
        }
        if (rr == 1) {
            if (nvalid > 0) Blink = 7;
            else {
                IsOver = true;
                RefreshScreen();
            }
        }
        if (nvalid > 0) return (best_val + 10 * nvalid);
        return (0);
    }

    function GetFld(nn, mm, ll) {
        if (nn < 0) return (-1);
        if (nn >= size) return (-1);
        if (mm < 0) return (-1);
        if (mm >= size) return (-1);

        return (Fld[nn][mm][ll]);
    }

    function IsValidMove(nn, mm, ll) {
        var ddx, ddy, dd, cc;
        if (Fld[nn][mm][ll] > -1) return (false);
        for (ddx = -1; ddx <= 1; ddx++) {
            for (ddy = -1; ddy <= 1; ddy++) {
                if (GetFld(nn + ddx, mm + ddy, ll) == 1 - Move) {
                    dd = 1;
                    do {
                        dd++;
                        cc = GetFld(nn + dd * ddx, mm + dd * ddy, ll);
                    }
                    while (cc == 1 - Move);
                    if (cc == Move) return (true);
                }
            }
        }
        return (false);
    }

    function MakeVirtualMove(nn, mm, rr) {
        var ddx, ddy, dd, cc, flipped = 0;
        val = 0;
        if (rr > 0) {
            for (ddx = 0; ddx < size; ddx++) {
                for (ddy = 0; ddy < size; ddy++)
                    Fld[ddx][ddy][rr] = Fld[ddx][ddy][rr - 1];
            }
        }
        if (Fld[nn][mm][rr] > -1) return (0);
        for (ddx = -1; ddx <= 1; ddx++) {
            for (ddy = -1; ddy <= 1; ddy++) {
                if (GetFld(nn + ddx, mm + ddy, rr) == 1 - Move) {
                    dd = 1;
                    do {
                        dd++;
                        cc = GetFld(nn + dd * ddx, mm + dd * ddy, rr);
                    }
                    while (cc == 1 - Move);
                    if (cc == Move) {
                        do {
                            dd--;
                            Fld[nn + dd * ddx][mm + dd * ddy][rr] = Move;
                            if (rr > 0) val += (FVal[nn + dd * ddx][mm + dd * ddy] + MoveVal);
                            flipped++;
                        }
                        while (dd > 1);
                    }
                }
            }
        }
        if (flipped > 0) Fld[nn][mm][rr] = Move;
        return (flipped);
    }

    function MakeRealMove(nn, mm) {
        var ddx, ddy, dd, cc, flipped = 0,
            ll = -1;
        hh = new Array(9);
        val = 0;
        if (Fld[nn][mm][0] > -1) return (0);
        for (ddx = -1; ddx <= 1; ddx++) {
            for (ddy = -1; ddy <= 1; ddy++) {
                ll++;
                hh[ll] = 0;
                if (GetFld(nn + ddx, mm + ddy, 0) == 1 - Move) {
                    dd = 1;
                    do {
                        dd++;
                        cc = GetFld(nn + dd * ddx, mm + dd * ddy, 0);
                    }
                    while (cc == 1 - Move);
                    if (cc == Move) {
                        hh[ll] = dd;
                        do {
                            dd--;
                            Fld[nn + dd * ddx][mm + dd * ddy][0] = Move;
                            flipped++;
                        }
                        while (dd > 1);
                    }
                }
            }
        }
        if (flipped == 0) return (0);
        Fld[nn][mm][0] = Move;
        if (History[MoveCount][0] != nn) {
            History[MoveCount][0] = nn;
            MaxMoveCount = MoveCount + 1;
        }
        if (History[MoveCount][1] != mm) {
            History[MoveCount][1] = mm;
            MaxMoveCount = MoveCount + 1;
        }
        for (ll = 0; ll < 9; ll++)
            History[MoveCount][ll + 2] = hh[ll];
        History[MoveCount][6] = Move;
        MoveCount++;
        if (MaxMoveCount < MoveCount)
            MaxMoveCount = MoveCount;
        Move = 1 - Move;
        for (ddx = 0; ddx < size; ddx++) {
            for (ddy = 0; ddy < size; ddy++) {
                if (IsValidMove(ddx, ddy, 0)) return (flipped);
            }
        }
        Move = 1 - Move;
        IsOver = true;
        for (ddx = 0; ddx < size; ddx++) {
            for (ddy = 0; ddy < size; ddy++) {
                if (IsValidMove(ddx, ddy, 0)) IsOver = false;
            }
        }
        if ((!IsOver) && (IsPlayer[0] || IsPlayer[1])) {
            if (Move == 0) alert("White must pass.");
            else alert("Black must pass.");
        }
        return (flipped);
    }

    function Clicked(nn, mm) {
        if (IsPlayer[Move]) {
            if (MakeRealMove(nn, mm, 0) == 0) alert("This is not a valid move !");
            else RefreshScreen();
        }
        $('#HelpButton').focus();
        $('#HelpButton').blur();
    }

    function MouseOver(nn, mm) {
        if (!IsPlayer[Move]) return;
        if (IsValidMove(nn, mm, 0))
        {
            $('img')[size * nn + mm].src = Pic[Move + 3].src;
        }
    }

    function MouseOut(nn, mm) {
        if (!IsPlayer[Move]) return;
        if (Fld[nn][mm][0] < 0) $('img')[size * nn + mm].src = Pic[0].src;
    }

    function RefreshPic(nn, mm) {
        $('img')[size * nn + mm].src = Pic[Fld[nn][mm][0] + 1].src;
    }

    function RefreshScreen() {
        var ii, jj, mm0 = 0,
            mm1 = 0;
        for (ii = 0; ii < size; ii++) {
            for (jj = 0; jj < size; jj++)
                $('img')[size * ii + jj].src = Pic[Fld[ii][jj][0] + 1].src;
        }
        if (Move == 0) $('#Msg').value = "Black to move";
        else $('#Msg').value = "White to move";
        if (MoveCount < 10)
            $('#Moves').value = " " + MoveCount + " ";
        else
            $('#Moves').value = MoveCount;
        if (IsOver) {
            for (ii = 0; ii < size; ii++) {
                for (jj = 0; jj < size; jj++) {
                    if (Fld[ii][jj][0] == 0) mm0++;
                    if (Fld[ii][jj][0] == 1) mm1++;
                }
            }
            if (mm0 > mm1) alert("Black has won with " + mm0 + " : " + mm1 + " points !");
            if (mm0 < mm1) alert("White has won with " + mm1 + " : " + mm0 + " points !");
            if (mm0 == mm1) alert("It's a draw !");
        }
    }

    function Resize() {
        if (navigator.appName == "Netscape") history.go(0);
    }

    function Help() {
        alert("The players alternatelly put their pieces on the board." +
            "\nYou can put a piece on an empty square to enclose" +
            "\none or more of your opponents pieces between your" +
            "\npieces and the piece you want to put down. All the" +
            "\nenclosed pieces of your opponent will turn their color" +
            "\nand be yours. If a player can not make a valid move," +
            "\nthen the other player continues to play. The winner is" +
            "\nthe player, who ends with the most pieces of his color" +
            "\non the board.");
    }

    Init();
    setInterval(function(){
        if (Blink > 0) {
            Blink--;
            if (Blink > 4) return;
            if (Blink == 0) {
                MakeRealMove(best_i, best_j);
                RefreshScreen();
                return;
            }
            if (Blink % 2 == 0) {
                Fld[best_i][best_j][0] = Move;
                RefreshPic(best_i, best_j);
                return;
            }
            if (Blink % 2 == 1) {
                Fld[best_i][best_j][0] = -1;
                RefreshPic(best_i, best_j);
                return;
            }
        }
        if (!IsOver) {
            if (IsPlayer[Move] == 0) {
                if (MoveCount >= 54)
                    MakeBestMove(0, Level[Move] + 1);
                else
                    MakeBestMove(0, Level[Move]);
            }
        }
        else return;
    }, 200);
};
