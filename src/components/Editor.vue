/* eslint-disable */
<script>
import draggable from 'vuedraggable'
import Quill from 'quill'
window.$ = window.jQuery = require('jquery')
let Inline = Quill.import('blots/inline')
let Block = Quill.import('blots/block')

class BoldBlot extends Inline { }
BoldBlot.blotName = 'bold'
BoldBlot.tagName = 'strong'

class ItalicBlot extends Inline { }
ItalicBlot.blotName = 'italic'
ItalicBlot.tagName = 'em'

class LinkBlot extends Inline {
  static create (url) {
    let node = super.create()
    node.setAttribute('href', url)
    node.setAttribute('target', '_blank')
    return node
  }

  static formats (node) {
    return node.getAttribute('href')
  }
}
LinkBlot.blotName = 'link'
LinkBlot.tagName = 'a'

class HeaderBlot extends Block {
  static formats (node) {
    return HeaderBlot.tagName.indexOf(node.tagName) + 1
  }
}
HeaderBlot.blotName = 'header'
HeaderBlot.tagName = ['H1', 'H2']

class CustomClass1 extends Block { }
CustomClass1.tagName = 'DIV'
CustomClass1.className = 'CustomClass1Class'
CustomClass1.id = 'ajay'

let data = ''
let pickIndex = null
let selectionLength = null
let dropIndex = null

export default {
  head: {
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js' }
    ]
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      editor: null,
      qull: null,
      range: null
    }
  },
  mounted () {
    Quill.register(BoldBlot)
    Quill.register(ItalicBlot)
    Quill.register(LinkBlot)
    Quill.register(HeaderBlot)
    Quill.register(CustomClass1)

    this.quill = new Quill('#editor-container')
    this.quill.root.addEventListener('drop', this.handleDrop, false)
    this.quill.root.addEventListener('dragover', this.handleDragover, false)
    this.quill.root.addEventListener('dragstart', this.handleTextChange, false)
    
    let quill = this.quill
    
    this.quill.addContainer($('#tooltip-controls').get(0))
    this.quill.addContainer($('#custom').get(0))
    this.quill.addContainer($('#sidebar-controls').get(0))

    // $('#custom-btn').addEventListener('dragstart', this.handleDragStart, false)
    // $('#custom-btn').addEventListener('dragleave', this.handleDragLeave, false)
    console.log('Quill.events->')
    console.log(Quill.events)
    this.quill.on(Quill.events.EDITOR_CHANGE, function (eventType, range) {
      if (eventType !== Quill.events.SELECTION_CHANGE) return
      if (range == null) return
      if (range.length === 0) {

        // new code start here
        var sel = quill.getSelection()
        var text = quill.getText(sel.index, sel.length)
        if (sel) {
          // GET ALL LINE LENGTH (MAY ADAPT FOR LINES WITH ONLY SPACES/TABS/...)
          var linesLengths = text.split('\n').map(function (line) {
            return line.length
          })

          var startPosition = sel.index
          for (var idx = 0; idx < linesLengths.length; idx++) {
            var currentLineLength = linesLengths[idx]
            // ONLY MARK LINES WITH SOME CONTENT
            if (currentLineLength > 0) {
              quill.insertText(startPosition, '*')
              quill.insertText(startPosition + currentLineLength + 1, '*')
              startPosition += currentLineLength + 2
            }
            // COUNT THE NEWLINE SYMBOL
          }
        }
        // if (sel.index - startPosition) = 1, then there is a new line.
        if (sel.index - startPosition == 1) {
          // new line detected
        }

        // new code end here
        $('#tooltip-controls').hide()
        this.range = range
        // getting error here
        let [block, offset] = quill.scroll.descendant(CustomClass1, range.index)
        if (block != null && block.domNode.firstChild instanceof HTMLBRElement) {
          let lineBounds = quill.getBounds(range)
          console.log(`lineBounds------>`, lineBounds)
          $('#sidebar-controls').removeClass('active').show().css({
            left: lineBounds.left + 640,
            top: lineBounds.top + 25
          })
          $('#custom').removeClass('active').show().css({
            left: 670,
            top: lineBounds.top + 35
          })
        } else {
          let lineBounds = quill.getBounds(range)
          console.log(`nothng here--  lineBounds---->`, lineBounds)
          console.log(`nothng here--  range---->`, range)
          $('#sidebar-controls').removeClass('active').show().css({
            left: 640,
            top: lineBounds.top + 25
          })
          $('#custom').removeClass('active').show().css({
            left: 670,
            top: lineBounds.top + 35
          })

          // $('#tooltip-controls, #sidebar-controls').hide()
          // $('#sidebar-controls').removeClass('active')
        }
      } else {
        // $('#sidebar-controls, #sidebar-controls').hide()
        // $('#sidebar-controls').removeClass('active')
        let rangeBounds = quill.getBounds(range)
        console.log('--------------------------------')
        // @TODO check for selection by keyboard, and make changes for new line detection

        $('#tooltip-controls').show().css({
          // left: rangeBounds.left + rangeBounds.width / 4 - $('#tooltip-controls').outerWidth() / 3,
          // left: rangeBounds.left + rangeBounds.width / 4 - $('#tooltip-controls').outerWidth() / 3,
          top: rangeBounds.bottom + 50
        })
      }
    })
    $('#bold-button').click(function () {
      quill.format('bold', true)
    })
    $('#italic-button').click(function () {
      let active = $(this).hasClass('active')
      quill.format('italic', true)
    })

    $('#link-button').click(function () {
      let value = prompt('Enter link URL')
      quill.format('link', value)
    })

    $('#header-1-button').click(function () {
      quill.format('header', 1)
    })

    $('#header-2-button').click(function () {
      quill.format('header', 2)
    })

    $('#show-controls').click(function () {
      $('#sidebar-controls').toggleClass('active')
      quill.focus()
    })
    $('#custom').click(function () {
      console.log('button is clicked')
      // quill.focus()
    })
  },
  components: {
    draggable
  },
  methods: {
    checkMove: function (e) {
      window.console.log('Future index: ' + e.draggedContext.futureIndex)
    },
    update () {
      this.$emit('input', this.editor.getText() ? this.editor.root.innerHTML : '')
    },
    handleTextChange (event) {
      console.log('---------------------------------------------')
      let textRange = this.quill.getSelection()
      if (textRange.length == 0) {
        console.log('nothing selected')
      } else {
        pickIndex = textRange.index
        selectionLength = textRange.length
        let text = this.quill.getText(textRange.index, textRange.length)
        console.log('text--->', text)
        $('#tooltip-controls').hide()
        console.log('pickIndex--->', pickIndex)
        data = text
      }

      // let value = event.target['__blot']['blot']['text']
      // value = value.toString().trim()
      // console.log('ajay is called==event typeof==>', value)
    },
    async handleDrop (evt) {
      evt.preventDefault()
      const index = (this.quill.getSelection() || {}).index || this.quill.getLength()
      console.log('Drop Index--->', index)
      this.quill.insertText(index, data, {
        // 'color': '#a3a3a3',
        // 'italic': true
      })
      console.log(`trying to delete text from index -- ${pickIndex} and to length -- ${selectionLength}`)
      // let lineBounds = this.quill.getBounds(this.range)
      // console.log(`line bound value--->${lineBounds}`)
      this.quill.deleteText(pickIndex, selectionLength)
      // this.quill.insertText(index, data, {})
    },
    handleDragStart (evt) {
      console.log('dragging started')
    },
    handleDragLeave (e) {
      console.log('dragging ended')
    },
    handleDragover (evt) {
      console.log('------------handleDragover-- dragging started---evt-----', evt)
      evt.preventDefault()
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection()
        console.log(`selection---===========->`, selection)
        const range = document.caretRangeFromPoint(evt.clientX, evt.clientY)
        console.log(`range==================>`, range)
        if (selection && range) {
          selection.setBaseAndExtent(range.startContainer, range.startOffset, range.startContainer, range.startOffset)
        }
        // console.log('range---->', range)
        // console.log('selection---->', selection)
      }
    }
  }
}
</script>

<template>
    <div id="app" ref="editor">
            <div id="tooltip-controls">
                <button id="bold-button"><i class="fa fa-bold"></i></button>
                <button id="italic-button"><i class="fa fa-italic"></i></button>
                <button id="link-button"><i class="fa fa-link"></i></button>
            </div>

            <div id="sidebar-controls">
                <!-- <div class="custom">
                  <svg viewBox="0 0 10 10" class="dragHandle" style="width: 14px; height: 14px; display: block; fill: inherit; flex-shrink: 0; backface-visibility: hidden;"><path d="M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z"></path></svg>
                </div> -->
                <button id="show-controls"><i class="fa fa-plus"></i></button>
                <span class="controls">
                    <button id="header-1-button"><i class="fa fa-header"><sub>1</sub></i></button>
                    <button id="header-2-button"><i class="fa fa-header"><sub>2</sub></i></button>
                </span>
            </div>

            <div id="custom">
              <!-- <button id="custom-btn" draggable="true"> -->
                <draggable
                  class="list-group"
                  ghost-class="ghost"
                  :move="checkMove"
                  @start="dragging = true"
                  @end="dragging = false"
                >
                  <div
                    class="list-group-item"
                    v-for="element in list"
                    :key="element.name"
                  >
                    {{ element.name }}
                  </div>
                </draggable>
                <!-- <svg viewBox="0 0 10 10" class="dragHandle" style="width: 14px; height: 14px; display: block; fill: inherit; flex-shrink: 0; backface-visibility: hidden;"><path d="M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z"></path></svg> -->
              <!-- </button> -->
            </div>
            <div id="editor-container">
                <p>Tell your story...</p>
            </div>
    </div>
</template>

<style>
* {
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
}

#editor-container {
  font-family: 'Open Sans', Helvetica, sans-serif;
  font-size: 1.2em;
  height: 100%;
  margin: 0 auto;
  width: 450px;
}
#editor-container .ql-editor {
  min-height: 100%;
  height: inherit;
  overflow-y: inherit;
  padding-bottom: 75px;
}
#editor-container .ql-editor > * {
  margin-top: 1.5em;
}
#editor-container .ql-editor > *:last-child {
  margin-bottom: 50px;
}
#editor-container h1 + p,
#editor-container h2 + p {
  margin-top: 0.5em; 
}
#editor-container blockquote {
  border-left: 4px solid #111;
  padding-left: 1em;
}
#editor-container hr {
  border: none;
  color: #111;
  letter-spacing: 1em;
  text-align: center;
}
#editor-container hr:before {
  content: '...';
}

#tooltip-controls {
  background-color: #111;
  border-radius: 4px;
  display: none;
  padding: 5px 10px;
  position: absolute;
}
#tooltip-controls::before {
  box-sizing: border-box;
  border-bottom: 6px solid #111;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  content: ' ';
  display: block;
  height: 6px;
  left: 50%;
  position: absolute;
  margin-left: -6px;
  margin-top: -6px;
  top: 0;
  width: 6px;
}
#tooltip-controls button {
  background-color: transparent;
  color: #fff;
  border: none;
}
#tooltip-controls button.active {
  color: #21b384;
}

#sidebar-controls {
  display: none;
  position: absolute;
}
#custom {
  display: none;
  position: absolute;
}
#sidebar-controls button {
  background-color: transparent;
  border: none;
  padding: 0;
}
#sidebar-controls i.fa {
  background-color: #fff;
  border: 1px solid #111;
  border-radius: 50%;
  color: #111;
  width: 32px;
  height: 32px;
  line-height: 32px;
}
#sidebar-controls .controls {
  display: none;
  margin-left: 15px;
}
#custom svg {
  display: none;
  margin-left: 15px;
}
#sidebar-controls #show-controls i.fa::before {
  content: "\f067";
}
#sidebar-controls.active .controls {
  display: inline-block;
}
#custom.active .dragHandle {
  display: inline-block;
}

#sidebar-controls.active #show-controls i.fa::before {
  content: "\f00d";
}

button {
  cursor: pointer;
  display: inline-block;
  font-size: 18px;
  padding: 0;
  height: 32px;
  width: 32px;
  text-align: center;
}
button:active, button:focus {
  outline: none;
}

</style>
