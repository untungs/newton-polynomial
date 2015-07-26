var banyakKolom = function () {
    return document.getElementById('row_i').childElementCount - 1; // <th> tidak ikut dihitung
},

    dataX = [],
    dataY = [];


function tambahKolom(awal, n) {
    var row_i = document.getElementById('row_i'),
        row_x = document.getElementById('row_x'),
        row_y = document.getElementById('row_y');

    for (var i = awal; i < awal+n; i++) {
        var newth = document.createElement('th');
        newth.appendChild(document.createTextNode(i));
        row_i.appendChild(newth);

        var newtdx = document.createElement('td');
        newtdx.appendChild(document.createElement('input'));
        newtdx.firstChild.id = 'x_' + i;
        row_x.appendChild(newtdx);
        
        var newtdy = document.createElement('td');
        newtdy.appendChild(document.createElement('input'));
        newtdy.firstChild.id = 'y_' + i;
        row_y.appendChild(newtdy);
    }
}

function updateSoal() {
    document.getElementById('n').innerHTML = banyakKolom();
    document.getElementById('orde').innerHTML = banyakKolom() - 1;  
}

function updateData() {
    dataX = [];
    dataY = [];
    for (var i = 0; i < banyakKolom(); i++) {
        dataX.push(parseFloat(document.getElementById('x_' + i).value));
        dataY.push(parseFloat(document.getElementById('y_' + i).value));
    }
    console.log(dataX);
    console.log(dataY);
}

/*
    @param x: array data yg diketahui pada sumbu x
    @param y: array data yg diketahui pada sumbu y
    @param n: banyaknya titik data
    @param xi: data yang dicari pada sumbu x
*/
function NewtonInt(x, y, n, xi) {
    // inisialisasi koefisien b dan interpolasi pada sumbu y
    var b = [],
        yint = [],
        ea = [];
    
    // kolom 1: y
    for (var i = 0; i < n; i++) {
        var line = [y[i]];
        b.push(line);
    }
  
    // kolom 2: orde ke-1, kolom 3: orde ke-2, dst
    for (var j = 1; j < n; j++) {
        for (var i = 0; i < n-j; i++) {
            b[i][j] = (b[i+1][j-1] - b[i][j-1]) / (x[i+j] - x[i]);
        }
    }
    
    var xterm = 1;
    yint[0] = b[0][0];
  
    for (var orde = 1; orde < n; orde++) {
        xterm = xterm * (xi - x[orde-1]);
        var yint2 = yint[orde-1] + b[0][orde] * xterm;
        ea[orde-1] = yint2 - yint[orde-1];
        yint[orde] = yint2;
    }
    console.log(b);
    console.log(yint);
    console.log(ea);
}

window.onload = function() {
    tambahKolom(banyakKolom(), 4);
    updateSoal();

    // attach event
    for (var i = 0; i < banyakKolom(); i++) {
        document.getElementById('x_' + i).onchange = function() {
            updateData();
        }
        document.getElementById('y_' + i).onchange = function() {
            updateData();
        }
    }
    document.getElementById('polynom').addEventListener('click', function (e) {
      var xi = document.getElementById('cari_x').value;
      NewtonInt(dataX, dataY, banyakKolom(), xi);
    });
}