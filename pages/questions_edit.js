var box = geid('content');
var boxcategory = geid('category')
var boxqid = geid('qid')

function validate_and_submit(){
  var q = box.value.trim()//.replace(/\n/g,'');
  box.value=q;
  q=q.split('$');

  q = q.map(function(i){return i.trim()});

  if(q.indexOf('')>=0){
    //如果各列中有空字符串
    alert('格式可能不符，检查输入。')
    return;
  }

  var question_object = null;
  switch (q.length) {
    case 2://问答题
    var question = q[0];
    var answer = q[1];
    question_object = {
      question:question,
      answer:answer,
      type:'ans',
    }
    break;

    case 5://四项单选题
    var question = q[0];
    var answer =[q[1],q[2],q[3],q[4]];
    question_object={
      question:question,
      answer:answer,
      type:'ch4',
    }
    break;


    default:
    alert('格式可能不符，检查输入。')
    break;
  }

  if(question_object)//if not null
  {
    question_object.qid = boxqid.value==''?undefined:boxqid.value.trim()
    question_object.category = boxcategory.value==''?null:boxcategory.value.trim()
    var method  = 'post';
    var url = '/q/'+question_object.category;
    if(question_object.qid) {
      method = 'PATCH';
      url = '/q/' + question_object.category + '/' + question_object.qid;
    }
    nkcAPI(url, method, question_object)
    .then(function(res){
      location.reload()
    })
    .catch(function(data) {
    	screenTopWarning(data.error)
    })
  }
}

function content_keypress(){
  e = event ? event :(window.event ? window.event : null);
  if(e.keyCode===13||e.which===13)
  {//validate_and_submit();
  }
}

geid('post').addEventListener('click', validate_and_submit);
geid('content').addEventListener('keyup', content_keypress);
geid('clear').addEventListener('click', clearContent);

function remove_question(url){
  nkcAPI(url,'delete',{})
  .then(function(){
    location.reload()
  })
  .catch(function(data){
  	screenTopWarning(data.error)
  })
}

function load_question(url){
  nkcAPI(url,'get',{})
  .then(function(q){
    var q = q.question;
    var k = q.question
    if(q.type=='ch4')
    {
      for(i in q.answer){
        k+='\n$'+q.answer[i]
      }
    }
    if(q.type=='ans'){
      k+='\n$'+q.answer
    }

    box.value= k

    var optiontag = document.createElement('option')
    optiontag.appendChild(document.createTextNode(q.category||''))

    boxcategory.appendChild(optiontag)
    boxcategory.value = q.category||''
    
    boxqid.value = q.qid
    boxqid.focus()
  })
  .catch(function(data) {
  	screenTopWarning(data.error)
  })
}

function clearContent() {
  $('#qid').val('');
  $('#content').val('');
}