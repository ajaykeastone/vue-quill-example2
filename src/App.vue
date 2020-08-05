<template>
  <div id="app">
    <quill-editor ref="myTextEditor"
              v-model="content"
              :config="editorOption">
      </quill-editor>
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import Editor from './components/Editor'
import HelloWorld from './components/HelloWorld'

export default {
  data () {
    return {
      name: 'app',
      content: '<h2>Example</h2>',
      editorOption: {}
    }
  },
  components: {
    Editor
  }
}
</script>
