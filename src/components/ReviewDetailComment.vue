<template>
  <div>
    <div class="d-flex justify-content-between my-2">
      <span>
        <h5 class="text-start d-inline">{{comment.user}} : {{ comment.content.substr(0, 40) }}</h5>
        <h6 class="d-inline" id="commentDate">({{ $moment(comment.created_at).format('MM월 DD일') }})</h6>
      </span>
      <span class="d-flex align-items-start">
        <span v-if="comment.user === this.userId" class="d-flex align-items-start">
          <i class="far fa-edit fa-lg commentbtn" style="color: white;" data-bs-toggle="modal" :data-bs-target="`#comment${comment.id}`" @click="setContent"></i>
          <i class="far fa-trash-alt fa-lg commentbtn" style="color: Tomato;" @click="commentDelete"></i>
        </span>
      </span>
    </div>
    <div class="modal fade" :id="`comment${comment.id}`" tabindex="-1" aria-labelledby="commentModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="commentModalLabel">Comment</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <input type="text" class="form-control" v-model="commentContent">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">취소</button>
            <button type="button" class="btn btn-primary" @click="commentUpdate" data-bs-dismiss="modal">댓글 수정</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

const SERVER_URL = process.env.VUE_APP_SERVER_URL

export default {
  name: 'ReviewDetailComment',
  props: {
    comment: {
      type: Object
    }
  },
  data: function () {
    return {
      commentContent: '',
    }
  },
  methods: {
    setContent: function () {
      this.commentContent = this.comment.content
    },
    commentUpdate: function () {
    let token = localStorage.getItem('jwt')
      if (!token) {
        this.$emit('need-login')
        } else {
          let config = {
            Authorization: `JWT ${token}`
          }

          axios({
            method: 'put',
            url: `${SERVER_URL}/community/comment/${this.comment.id}/`,
            data: {
              content: `${this.commentContent}`
            },
            headers: config
          })
            .then(() => {
              // console.log(res)
              this.$emit('comment-update')
              // this.$store.dispatch('reviewDetail', this.comment.review)
            })
            .catch(() => {
              // console.log(err)
            })
      }
    },
    commentDelete: function () {
    let token = localStorage.getItem('jwt')
    if (!token) {
      this.$emit('need-login')
      } else {
        let config = {
          Authorization: `JWT ${token}`
        }
        axios({
          method: 'delete',
          url: `${SERVER_URL}/community/comment/${this.comment.id}/`,
          headers: config
        })
          .then(() => {
            // console.log(res)
            this.$emit('comment-update')
          })
      }
    }
  },
  computed: {
    ...mapState([
      'userId'
    ])
  },
}
</script>

<style scoped>
#commentDate {
  color: #a1a1a1;
}

.commentbtn {
  cursor: pointer;
}

</style>