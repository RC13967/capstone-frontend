import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "react-bootstrap";
import { useHistory } from 'react-router';
import { userContext } from "./App"
import { Button, Container, Modal, Form } from "react-bootstrap";
import { faComments, faThumbsDown, faThumbsUp, faUserPen } from "@fortawesome/free-solid-svg-icons";
export function ShowPosts() {
    const history = useHistory();
    const { posts, setPosts, setPicture, picture } = useContext(userContext);
    const email = localStorage.getItem('User');
    const firstName = localStorage.getItem("FirstName");
    const lastName = localStorage.getItem("LastName");
    let userId = localStorage.getItem("UserId");
    if (!email) {
        history.push("/");
    }
    const [show, setShow] = useState(false);
    const [showProfile, setShowProfile] = useState(false)
    const [postText, setPostText] = useState('');
    const [file, setFile] = useState([]);
    const [profileFile, setProfileFile] = useState([]);
    const [fileName, setFileName] = useState('');
    const [dataState, setDataState] = useState(false);
    const [sortState, setSortState] = useState(false);
    const [myPost, setMyPost] = useState(false);
    const handleCloseProfile = () => setShowProfile(false);
    const handleShowProfile = () => setShowProfile(true);
    const handleChangeProfile = (e) => {
        setProfileFile(e.target.files[0]);
    }
    const handlePostProfile = () => {
        var formDataProfile = new FormData();
        formDataProfile.append("profileFile", profileFile);
        formDataProfile.append("email", email);
        fetch(`https://capstone-ranjith.herokuapp.com/addProfile`, {
            method: "PUT",
            body: formDataProfile,
        }).then((data) => data.json())
            .then((jsonData) => profileFetched(jsonData));
        handleCloseProfile();
    }
    function profileFetched(jsonData) {
        localStorage.setItem("Picture", jsonData.finalFile);
        setPicture(jsonData.finalFile);

    }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleChangeFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }
    const handlePost = () => {
        var formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);
        formData.append("email", email);
        formData.append("postText", postText)
        fetch(`https://capstone-ranjith.herokuapp.com/addPost`, {
            method: "PUT",
            body: formData,
        });
        handleClose();
    }
    const sortByLikes = (e) => {
        e.preventDefault();
        let oldPosts = posts;
        if (oldPosts.length > 0) {
            setPosts(oldPosts.sort((a, b) => b.likes - a.likes));
            setSortState(!sortState);
        }
    }
    const sortByDisikes = (e) => {
        e.preventDefault();
        let oldPosts = posts;
        if (oldPosts.length > 0) {
            setPosts(oldPosts.sort((a, b) => b.dislikes - a.dislikes));
            setSortState(!sortState);
        }
    }
    const sortByDate = (e) => {
        e.preventDefault();
        let oldPosts = posts;
        if (oldPosts.length > 0) {
            setPosts(oldPosts.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)));
            setSortState(!sortState);
        }
    }

    function getPosts() {
        setMyPost(false);
        fetch(`https://capstone-ranjith.herokuapp.com/globalPosts`, {
            method: "POST",
            body: JSON.stringify({ email: email }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((data) => data.json())
            .then((data) => data.length > 0 ?
                setPosts(data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))) : setPosts(data))
    }
    function getMyPosts() {
        setMyPost(true);
        fetch(`https://capstone-ranjith.herokuapp.com/myPosts`, {
            method: "POST",
            body: JSON.stringify({ email: email }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((data) => data.json())
            .then((data) => data.length > 0 ?
                setPosts(data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))) : setPosts(data))

    }

    useEffect(() => {
        if (!myPost) {
            getPosts();
        } else {
            getMyPosts();
        }
        setPicture(localStorage.getItem("Picture"));
        // eslint-disable-next-line
    }, [dataState])
    return (
        <Container>
            <div className="profile-header">
                <div>
                    <img className="profile" src={picture} alt=""
                        onError={(e) =>
                            e.target.src = "https://media.tarkett-image.com/large/TH_24567081_24594081_24596081_24601081_24563081_24565081_24588081_001.jpg"} />
                    <div className="user-name">{firstName} {lastName}</div>
                </div>
                <div>
                    <div className="profile-update-text">Update Profile</div>
                    <Button variant="outline-success" onClick={handleShowProfile}>
                        <FontAwesomeIcon icon={faUserPen} size="2x" />
                    </Button>
                </div>
            </div>
            <div className="d-grid gap-5 have-say">
                <Modal
                    show={showProfile}
                    onHide={handleCloseProfile}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Update Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload image</Form.Label>
                            <Form.Control type="file" accept="image/*"
                                onChange={(e) => handleChangeProfile(e)} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseProfile}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handlePostProfile}>Post</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <div className="d-grid gap-5 post-button">
                <Button variant="outline-success" size='lg'
                    onClick={handleShow}>wanna post something ?</Button>
            </div>

            <div className="d-grid gap-5 have-say">
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Post this</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" >
                            <Form.Control as="textarea" rows={3} placeholder="write something to post"
                                onChange={(e) => setPostText(e.target.value)} />
                        </Form.Group>
                        {/* {file ? 
                            (file.type.split('/')[0] == "audio" ? <audio src={preview} controls></audio> :
                                (file.type.split('/')[0] == "video" ?
                                    <video src={preview} width="300" height="200" controls></video> :
                                    (file.type.split('/')[0] == "image" ? <img src={preview} className="image" /> : <></>)
                                ))
                        :<></>} */}


                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload images / videos / audios</Form.Label>
                            <Form.Control type="file" accept="audio/*,video/*,image/*"
                                onChange={(e) => handleChangeFile(e)} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handlePost}>Post</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <div className="get-buttons">
                <Button variant="outline-primary" onClick={() => getPosts()}>All Posts</Button>
                <Button variant="outline-primary" onClick={() => getMyPosts()}>My Posts</Button>
            </div>
            <hr />
            <div className="get-buttons">
                <span className="sort-by">Sort by:</span>
                <Button variant="outline-primary" onClick={(e) => sortByLikes(e)}>Likes</Button>
                <Button variant="outline-primary" onClick={(e) => sortByDisikes(e)}>dislikes</Button>
                <Button variant="outline-primary" onClick={(e) => sortByDate(e)}>date</Button>
            </div>
            <div className="post-cards" >
                {posts.length > 0 ? posts.map((post, index) =>
                    <Posts post={post} email={email} picture={picture} key={index} myPost={myPost}
                        dataState={dataState} setDataState={setDataState} userId = {userId}/>) : <></>}
            </div>
        </Container>
    )
}
function Posts({ post, email, picture, dataState, setDataState, myPost, userId }) {
    const [commentsOpened, setCommentsOpened] = useState(false);
    const [commentedValue, setCommentedValue] = useState("");
    const getLikes = (e, post, email) => {
        e.preventDefault();
        fetch(`https://capstone-ranjith.herokuapp.com/likes`, {
            method: "PUT",
            body: JSON.stringify({ email: email, post: post }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(() => setDataState(!dataState))
    }
    const getDisLikes = (e, post, commentId) => {
        e.preventDefault();
        fetch(`https://capstone-ranjith.herokuapp.com/disLikes`, {
            method: "PUT",
            body: JSON.stringify({ email: email, post: post }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(() => setDataState(!dataState))
    }
    const getComments = (e, post, commentId) => {
        e.preventDefault();
        setCommentsOpened(true);
    }
    const submitComment = (e, commentedValue) => {
        setCommentedValue("");
        e.preventDefault();
        fetch(`https://capstone-ranjith.herokuapp.com/comments`, {
            method: "PUT",
            body: JSON.stringify({ email: email, post: post, comment: commentedValue }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(() => setDataState(!dataState));
    }
    const deletePost = (e, post, email) => {
        e.preventDefault();
        fetch(`https://capstone-ranjith.herokuapp.com/deletePost`, {
            method: "PUT",
            body: JSON.stringify({ email: email, post: post }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(() => setDataState(!dataState))
    }
    return (
        <div className="post-card">
            <div className="posted-user-details">
                <img className="posted-user-pic" src={post.postedUserPic} alt=""
                    onError={(e) =>
                        e.target.src = "https://media.tarkett-image.com/large/TH_24567081_24594081_24596081_24601081_24563081_24565081_24588081_001.jpg"} />
                <div>
                    <div className="">{post.postedUserName}</div>
                    <div>{post.uploadDate}</div>
                </div>
                {myPost ? <Button variant="danger" onClick = {(e)=>deletePost(e, post, email)}>Delete</Button> : <></>}
            </div>
            <div className="post-text">{post.postText}</div>
            {
                post.file ?
                    (

                        post.fileType.split('/')[0] === "audio" ?

                            (<audio className="posted-file" src={post.file} controls></audio>) : (
                                post.fileType.split('/')[0] === "video" ?
                                    (<video className="posted-file" src={post.file} controls></video>) : (
                                        post.fileType.split('/')[0] === "image" ?
                                            (<img className="posted-file" src={post.file} alt="" />)
                                            : (<></>)

                                    )
                            )
                    ) : (<></>)
            }
            <div>
                <button className="like-button" onClick={(e) => getLikes(e, post, email)}>
                    <FontAwesomeIcon icon={faThumbsUp} size='1x'
                        color={post.liked ? "green" : ""} />
                    <Badge pill bg="primary">{post.likes} </Badge>
                </button>
                <button className="like-button" onClick={(e) => getDisLikes(e, post, email)}>
                    <FontAwesomeIcon icon={faThumbsDown} size='1x'
                        color={post.disliked ? "green" : ""} />
                    <Badge pill bg="danger">{post.dislikes} </Badge>
                </button>
                <button className="like-button" onClick={(e) => getComments(e, post, email)}>
                    <FontAwesomeIcon icon={faComments} size='1x'
                        color="orange" />
                    <Badge pill bg="info">{post.comments} </Badge>
                </button>

            </div>
            {commentsOpened ? <>
                <div>
                    <img className="comment-user-pic" src={picture} alt=""
                        onError={(e) =>
                            e.target.src = "https://media.tarkett-image.com/large/TH_24567081_24594081_24596081_24601081_24563081_24565081_24588081_001.jpg"} />
                    <input className="comment-box" value={commentedValue} placeholder="type a comment here"
                        onChange={(e) => setCommentedValue(e.target.value)} />
                    {commentedValue ?
                        <Button variant="primary" onClick={(e) => submitComment(e, commentedValue)} >comment</Button> : <></>}

                </div>
                <hr />
                {post.commentDetails.length > 0 ? post.commentDetails.map((commentDetail, index) =>
                    <CommentsComponent commentDetail={commentDetail} post={post} dataState={dataState} email={email}
                        setDataState={setDataState} picture={picture} key={index} userId={userId} />) : <></>}</>
                : (<></>)}
            <div>

            </div>
        </div>
    )
}
function CommentsComponent({ commentDetail, post, dataState, email, setDataState, picture, userId }) {
    const [replyOpened, setReplyOpened] = useState(false);
    const [repliedValue, setRepliedValue] = useState("");
    const getCommentLikes = (e, commentDetails, postId) => {
        e.preventDefault();
        fetch(`https://capstone-ranjith.herokuapp.com/commentLikes`, {
            method: "PUT",
            body: JSON.stringify({ commentDetails: commentDetails, postId: postId, email: email }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(() => setDataState(!dataState))
    }
    const getCommentDisLikes = (e, commentDetails, postId) => {
        e.preventDefault();
        fetch(`https://capstone-ranjith.herokuapp.com/commentDisLikes`, {
            method: "PUT",
            body: JSON.stringify({ commentDetails: commentDetails, postId: postId, email: email }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(() => setDataState(!dataState))
    }
    const getCommentReplies = (e, commentDetails, postId) => {
        e.preventDefault();
        setReplyOpened(true);
    }
    const submitReply = (e, repliedValue, commentDetails, postId) => {
        setRepliedValue("");
        e.preventDefault();
        fetch(`https://capstone-ranjith.herokuapp.com/replies`, {
            method: "PUT",
            body: JSON.stringify({ email: email, reply: repliedValue, commentDetails: commentDetails, postId: postId }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(() => setDataState(!dataState))
    }
    const deleteComment = (e, commentDetails, post, email) => {
        e.preventDefault();
        fetch(`https://capstone-ranjith.herokuapp.com/deleteComment`, {
            method: "PUT",
            body: JSON.stringify({ email: email, commentDetails: commentDetails, post: post}),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(() => setDataState(!dataState))
    }
    return (
        <>
            <div className="comment-details">
                <img className="comment-user-pic" src={commentDetail.picture} alt=""
                    onError={(e) =>
                        e.target.src = "https://media.tarkett-image.com/large/TH_24567081_24594081_24596081_24601081_24563081_24565081_24588081_001.jpg"} />
                <div className="comment">
                    <div><b> {commentDetail.firstName} {commentDetail.lastName} </b>  {commentDetail.commentedDate}</div>
                    <div>{commentDetail.comment}</div>
                  {userId === commentDetail.userId ?
                   <Button variant="danger" onClick = {(e)=>deleteComment(e,commentDetail, post, email)}>Delete</Button>
                    : <></>} 
                  
                    <button className="like-button" onClick={(e) => 
                        getCommentLikes(e, commentDetail, post.postId)}>
                        <FontAwesomeIcon icon={faThumbsUp} size='1x'
                            color={commentDetail.liked ? "green" : ""} />
                        <Badge pill bg="primary">{commentDetail.likes} </Badge>
                    </button>
                    <button className="like-button" onClick={(e) =>
                        getCommentDisLikes(e, commentDetail, post.postId)}>
                        <FontAwesomeIcon icon={faThumbsDown} size='1x'
                            color={commentDetail.disliked ? "green" : ""} />
                        <Badge pill bg="danger">{commentDetail.dislikes} </Badge>
                    </button>
                    <button className="like-button" onClick={(e) =>
                        getCommentReplies(e, commentDetail, post.postId)}>
                        <FontAwesomeIcon icon={faComments} size='1x'
                            color="orange" />
                        <Badge pill bg="info">{commentDetail.replies} </Badge>
                    </button>
                </div>

            </div>
            {replyOpened ? <>
                <div>
                    <img className="comment-user-pic" src={picture} alt=""
                        onError={(e) =>
                            e.target.src = "https://media.tarkett-image.com/large/TH_24567081_24594081_24596081_24601081_24563081_24565081_24588081_001.jpg"} />
                    <input className="comment-box" value={repliedValue} placeholder="type a reply here"
                        onChange={(e) => setRepliedValue(e.target.value)} />
                    {repliedValue ?
                        <Button variant="primary" onClick={(e) => submitReply(e, repliedValue, commentDetail, post.postId)} >reply</Button> : <></>}

                </div>
                {commentDetail.replyDetails.length > 0 ?
                    commentDetail.replyDetails.map((replyDetail, index) =>
                        <RepliesComponent replyDetail={replyDetail} key={index} userId = {userId} >
                        </RepliesComponent>)
                    : <></>}
            </> : <></>}
        </>
    )
}
function RepliesComponent({replyDetail}) {
    return (
        <div className="comment-details reply">
            <img className="comment-user-pic" src={replyDetail.picture} alt=""
                onError={(e) =>
                    e.target.src = "https://media.tarkett-image.com/large/TH_24567081_24594081_24596081_24601081_24563081_24565081_24588081_001.jpg"} />
            <div className="comment">
                <div><b> {replyDetail.firstName} {replyDetail.lastName}
                </b>  {replyDetail.replyDate}</div>
                <div>{replyDetail.reply}</div>
            </div>

        </div>
    )
}