import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from 'actions'
import Like from './like'
import Prenext from './prenext'
import Comment from './comment'
import Content from './content'
import LoginModal from '../Login/modal'

const mapStateToProps = state =>{
  return {
    articleDetail: state.articleDetail.toJS(),
    commentList: state.commentList.toJS(),
    prenextArticle: state.prenextArticle.toJS(),
    auth: state.auth.toJS(),
    sns: state.sns.toJS()
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

@connect(mapStateToProps,mapDispatchToProps)
export default class Article extends Component {
  constructor(props){
    super(props)
    this.toggleLike = this.toggleLike.bind(this)
    this.handleSubmitComment = this.handleSubmitComment.bind(this)
    this.handleSubmitReply = this.handleSubmitReply.bind(this)
    this.openLoginModal = this.openLoginModal.bind(this)
    this.closeLoginModal = this.closeLoginModal.bind(this)
    this.state = {showModal:false}
  }

  static propTypes = {
    articleDetail: PropTypes.object.isRequired,
    commentList: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    prenextArticle: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    sns: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  static fetchData({id}){
    return [
      Actions.getArticleDetail(id),
      Actions.getCommentList(id),
      Actions.getPrenext(id),
      Actions.getSnsLogins()
    ]
  }

  componentDidMount() {
    const { match,actions,articleDetail } = this.props
    if(!articleDetail._id || articleDetail._id !== match.params.id){
      this.fetchArticleData(match.params.id)
      actions.getSnsLogins()
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.match.params.id !== this.props.match.params.id){
      this.fetchArticleData(nextProps.match.params.id)
    }
  }

  fetchArticleData(id){
    const { actions} = this.props
    if(id){
      //??????????????????
      actions.getArticleDetail(id)
      //????????????
      actions.getCommentList(id)
      //??????????????????
      actions.getPrenext(id)
    }
  }

  toggleLike(){
    const {actions,match,auth} = this.props
    if(auth.token){
      actions.toggleLike(match.params.id)
    }else{
      this.openLoginModal()
    }
  }
  handleSubmitComment(e,content){
    e.preventDefault()
    const {actions,match} = this.props
    //???????????????
    actions.addComment({aid:match.params.id,content:content})
  }
  //????????????
  handleSubmitReply(e,cid,content){
    e.preventDefault()
    const {actions} = this.props
    actions.addReply(cid,{content:content})
  }

  openLoginModal(){
    this.setState({showModal:true})
  }

  closeLoginModal(){
    this.setState({showModal:false})
  }

  render() {
    const { articleDetail,commentList,prenextArticle,auth,sns } = this.props
    return (
      <div className="article-box">
        <Content articleDetail={articleDetail} />
        <Like likeCount={articleDetail.like_count} isLike={articleDetail.isLike} toggleLike={this.toggleLike} />
        <Prenext prenextArticle={prenextArticle}  />
        <Comment commentList={commentList} auth={auth} 
          submitComment={this.handleSubmitComment} 
          submitReply={this.handleSubmitReply}
          openLoginModal={this.openLoginModal} />
        <LoginModal logins={sns.logins} isShowModal={this.state.showModal} closeModal={this.closeLoginModal} />
      </div>
    )
  }
}