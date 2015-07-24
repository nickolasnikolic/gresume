<?php
require 'vendor/autoload.php';
require 'classes/indeed.php';

error_reporting(-1);//tell me stuff

$app = new \Slim\Slim();

$app->get('/home', function(){

  $url = parse_url(getenv("CLEARDB_DATABASE_URL"));

  $server = $url["host"];
  $user = $url["user"];
  $pass = $url["pass"];
  $database = substr($url["path"], 1);

  $db = new PDO("mysql:host=$server;dbname=$database;charset=utf8", $user, $pass);

  //$db = new PDO("mysql:host=localhost;dbname=gresume;charset=utf8", 'root', '');
  $stmtUserId = $db->prepare('SELECT * FROM stories ORDER BY stories.id DESC LIMIT 200;');
  $stmtUserId->execute();
  $resultUserId = $stmtUserId->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($resultUserId);
});

$app->post('/home', function(){

  $title = $_POST['title'];
  $location = $_POST['location'];
  $description = $_POST['description'];
  $wages = $_POST['wages'];

  $title = htmlentities($title);
  $location = htmlentities($location);
  $description = htmlentities($description);
  $wages = htmlentities($wages);


  $url = parse_url(getenv("CLEARDB_DATABASE_URL"));

  $server = $url["host"];
  $user = $url["user"];
  $pass = $url["pass"];
  $database = substr($url["path"], 1);

  $db = new PDO("mysql:host=$server;dbname=$database;charset=utf8", $user, $pass);

  //$db = new PDO("mysql:host=localhost;dbname=gresume;charset=utf8", 'root', '');
  $stmtUserId = $db->prepare('INSERT INTO stories (title,location,description,wages) VALUES (:title,:location,:description,:wages);');
  $stmtUserId->bindParam( ':title', $title );
  $stmtUserId->bindParam( ':location', $location );
  $stmtUserId->bindParam( ':description', $description );
  $stmtUserId->bindParam( ':wages', $wages );
  $stmtUserId->execute();
});

$app->get('/selection/:job', function($job){
  $client = new Indeed("4779755742469402");

  $params = array(
      "q" => $job,
      "userip" => $_SERVER['REMOTE_ADDR'],
      "useragent" => $_SERVER['HTTP_USER_AGENT'],
      "limit" => "10"
  );

  $results = $client->search($params);

  echo json_encode($results);

});

$app->get('/selection/:job/:location', function($job,$location){
  $client = new Indeed("4779755742469402");

  $params = array(
      "q" => $job,
      "l" => $location,
      "userip" => $_SERVER['REMOTE_ADDR'],
      "useragent" => $_SERVER['HTTP_USER_AGENT'],
      "limit" => "10"
  );

  $results = $client->search($params);

  echo json_encode($results);

});

$app->get('/selection/:job/:location/:page', function($job,$location,$page){
  $client = new Indeed("4779755742469402");

  $params = array(
      "q" => $job,
      "l" => $location,
      "start" => $page * 25,
      "userip" => $_SERVER['REMOTE_ADDR'],
      "useragent" => $_SERVER['HTTP_USER_AGENT'],
      "limit" => "10"
  );

  $results = $client->search($params);

  echo json_encode($results);

});

$app->post('/contact', function(){
  //send message in content
  $message = $_POST['name'];
  $message .= $_POST['phone'];
  $message .= $_POST['message'];

  echo $message;
});

$app->run();
