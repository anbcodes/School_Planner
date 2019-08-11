<template>
  <div class="editor">
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <v-layout row wrap>
        <v-flex>
          <v-btn icon small :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
            <v-icon>format_bold</v-icon>
          </v-btn>
        </v-flex>
        <v-flex>
          <v-btn icon small :class="{ 'is-active': isActive.italic() }" @click="commands.italic">
            <v-icon>format_italic</v-icon>
          </v-btn>
        </v-flex>
        <v-flex>
          <v-btn icon small :class="{ 'is-active': isActive.strike() }" @click="commands.strike">
            <v-icon>strikethrough_s</v-icon>
          </v-btn>
        </v-flex>
        <v-flex>
          <v-btn
            icon
            small
            :class="{ 'is-active': isActive.underline() }"
            @click="commands.underline"
          >
            <v-icon>format_underlined</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </editor-menu-bar>

    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import { Bold, Italic, Strike, Underline } from "tiptap-extensions";
export default {
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: {
    value: String
  },
  created() {
    this.editor.setContent(this.value);
  },
  data() {
    return {
      editor: new Editor({
        extensions: [new Bold(), new Italic(), new Strike(), new Underline()],
        content: "",
        onUpdate: ({ getHTML }) => {
          this.$emit("input", getHTML());
        }
      })
    };
  },
  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>
<style scoped>
.editor__content {
  border-style: solid;
  border-width: thin;
  border-color: black;
  color: black;
  padding: 2%;
}
</style>