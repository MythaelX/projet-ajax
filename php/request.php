<?php
require_once('database.php');

//------------------------------------------------------------------------------
//--- sendJsonData------------------------------------------------------------
//------------------------------------------------------------------------------
// sendJsonData.

function sendJsonData($message, $h){
    header($h);
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-control: no-store, no-cache, must-revalidate');
    header('Pragma: no-cache');
    echo json_encode($message);
}

//------------------------------------------------------------------------------
//--- authenticate------------------------------------------------------------
//------------------------------------------------------------------------------
// authenticate.

function authenticate($db){
    $login = $_SERVER['PHP_AUTH_USER'];
    $pass = $_SERVER['PHP_AUTH_PW'];

    if(!dbCheckUserInjection($db, $login, $pass)){
        header('HTTP/1.1 401 Unauthorized');
        exit;
    }

    $token = base64_encode(openssl_random_pseudo_bytes(12));
    dbAddToken($db, $login, $token);
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-control: no-store, no-cache, must-revalidate');
    header('Pragma: no-cache');
    echo $token;

    exit;
}

function verifyToken($db){
    $headers = getallheaders();
    $token = $headers['Authorization'];
    if (preg_match('/Bearer (.*)/', $token, $tab))$token = $tab[1];
    if(!($login = dbVerifyToken($db, $token))){
        header('HTTP/1.1 401 Unauthorized');
        exit;
    }
    return $login;
}

// Database connexion.
$db = dbConnect();
if (!$db)
{
  header ('HTTP/1.1 503 Service Unavailable');
  exit;
}
// Check the request.
$requestType = $_SERVER['REQUEST_METHOD'];
$request = substr($_SERVER['PATH_INFO'], 1);
$request = explode('/', $request);
$requestRessource = array_shift($request);

// Check the id associated to the request.
$id = array_shift($request);
if ($id == '')
  $id = NULL;
$data = false;

//request comments
if($requestRessource == 'comments'){

	// GET comments
	if($requestType =='GET'){
			$data = dbRequestComments($db,$id);
    }

	//POST comments
  if($requestType =='POST'){
		$data = dbAddComment($db, verifyToken($db),$_POST['photoId'],$_POST['text']);
  }

	//PUT comments
	if($id!=NULL && $requestType =='PUT'){
		parse_str(file_get_contents('php://input'),$_PUT);
		$data = dbModifyComment($db, verifyToken($db), $_PUT['photoId'], $_PUT['text']);
	}

  //Delete comments
	if($id!=NULL && $requestType =='DELETE'){
		$data = dbDeleteComment($db, verifyToken($db),intval($id));
  }
  // Send data to the client.
  sendJsonData($data,'HTTP/1.1 200 OK');
  exit;

//request photos
}else if ($requestRessource == 'photos'){
  if ($id != NULL){
    $data = dbRequestPhoto($db, intval($id));
    // Send data to the client.
    sendJsonData($data,'HTTP/1.1 200 OK');
  }else{
    $data = dbRequestPhotos($db);
    // Send data to the client.
    sendJsonData($data,'HTTP/1.1 200 OK');
  }

//request authenticate
}else if($requestRessource == 'authenticate'){
    authenticate($db);

//request not find
}else{
  header ('HTTP/1.1 400 Bad Request');
  exit;
}

$login = verifyToken($db);
exit;
?>
