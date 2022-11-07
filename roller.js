function roll(){
  var randomNumber = Math.floor(Math.random() * 20) + 1;
  return randomNumber
}

function printNumbers(r1, r2){
  var placeholder = document.getElementById('roll_result_1');
  placeholder.innerHTML = r1;
  placeholder = document.getElementById('roll_result_2');
  placeholder.innerHTML = r2;
}

var button = document.getElementById('roll_button');

button.onclick = function (){
  var result_1 = roll();
  var result_2 = roll();
  printNumbers(result_1, result_2);
};
