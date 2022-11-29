<template class="base">
  <div id="app">
    <teleport to="body">
      <BaseModal v-if="showModal">
        <template #heading> Upload Code </template>
        <template #body>
          <form>
            <div>
              <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  ref="file"
                  accept=".cpp, .cs, .py, .java, .txt, .html, .css, .js, .ts"
              />
              <div v-show="fileTypeError" class="error mt-2">
                Please select a valid file!
              </div>
            </div>
          </form>
        </template>
        <template #footer>
          <div
              class="d-flex flex-row justify-items-center justify-content-between"
          >
            <div>
              <button class="btn-success btn mb-2 mx-5" @click="getFile">
                Upload
              </button>
            </div>
            <div>
              <button class="btn-danger btn mx-5" @click="closeModal">
                Cancel
              </button>
            </div>
          </div>
        </template>
      </BaseModal>
      <BaseModal v-if="showWarningModal">
        <template #heading> Clear Cache </template>
        <template #body>
          <p>This will clear the locally stored code.</p>
          <p>Are you sure you want to continue?</p></template
        >
        <template #footer>
          <div
              class="d-flex flex-row justify-items-center justify-content-between"
          >
            <div>
              <button class="btn-danger btn mb-2 mx-5" @click="clearStore">
                Clear Cache
              </button>
            </div>
            <div>
              <button class="btn-primary btn mx-5" @click="closeWarningModal">
                Cancel
              </button>
            </div>
          </div>
        </template>
      </BaseModal>
      <BaseModal v-if="showRunModal">
        <template #heading> Run your Code </template>
        <template #body>
          <div class="input-group mb-2">
            <span class="input-group-text">STDIN</span>
            <textarea class="form-control" aria-label="STDIN" rows="2" v-model="input"></textarea>
          </div>
          <div class="input-group">
            <span class="input-group-text">STDOUT</span>
            <textarea
                class="form-control"
                aria-label="STDOUT"
                readonly
                rows="2"
                v-model="output"
            ></textarea>
          </div>
        </template>
        <template #footer>
          <div
              class="d-flex flex-row justify-items-center justify-content-between"
          >
            <div>
              <button
                  class="btn-success btn mb-2 mx-5"
                  @click="runCode"
                  :disabled="runDisabled"
                  :title="runMessage"
              >
                {{ this.runMessage }}
              </button>
            </div>
            <div>
              <button class="btn-danger btn mx-5" @click="closeRunModal">
                Cancel
              </button>
            </div>
          </div>
        </template>
      </BaseModal>
      <BaseModal v-if="showColabModal">
        <template #heading>Colab Mode</template>
        <template #body>
          <form class="input-group mb-4" @submit.prevent="joinRoom">
            <input type="text" class="form-control" placeholder="Join Room!" v-model="customRoomID">
            <button @click="joinRoom" class="btn btn-primary" type="button">Join This Room!</button>
          </form>
          <form class="input-group mb-4" @submit.prevent="createRoom">
            <button class="btn btn-success">Create A Room!</button>
            <input type="text" class="form-control" placeholder="Your Room" readonly v-model="roomID">
            <button type="reset" @click="leaveRoom" class="btn btn-warning" :disabled="!isConnectedToRoom">Leave The Room!</button>
          </form>
          <div class="d-sm-flex">
          </div>
        </template>
        <template #footer>
          <button @click="closeColabModal" class="btn btn-danger">Cancel</button>
        </template>
      </BaseModal>
    </teleport>

    <TopNav
      @change-language="changeLang"
      @save-code="saveCode"
      @upload="openModal"
      @clear-store="openWarningModal"
      @run-code="openRunModal"
      @colab="openColabModal"
    />

    <VAceEditor
      v-model:value="savedCode"
      @init="getEditor"
      :lang="lang"
      theme="vibrant_ink"
      min-lines=100
      max-lines=2000
      :key="lang"
      :options="editorOptions"
      v-on:change="sendData"
    />
    
  </div>
</template>

<style>
body {
  margin: 0;
  overflow: hidden;
}
</style>
<style scoped>
.base {
  z-index: 0;
}
.error {
  color: red;
  text-align: center;
}
p {
  text-align: center;
}
</style>

<script>
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/theme-vibrant_ink'
import 'ace-builds/src-noconflict/ext-language_tools';

import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/mode-plain_text'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-csharp'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-css'

import TopNav from "./components/layouts/TopNav.vue";
import { saveAs } from "file-saver";
import Extensions from "./constants/fileExt";
import BaseModal from "./components/modals/BaseModal.vue";
import fileTypes from "./constants/extenstions";
import runtimes from "./constants/runtimes";
import Axios from "axios";
import SocketConnectionService from "@/services/socket-connection-service.js";
import {nanoid} from "nanoid";
import {debounce} from "lodash";

const deb_function = debounce((value)=>{
  SocketConnectionService.sendData(value);
  console.log('data sent');
}, 1000);

export default {
  created() {
    SocketConnectionService.createConnection();
  },
  mounted() {
    console.log(SocketConnectionService.socket);
    SocketConnectionService.socket.on('dataChange', data => {
      console.log("data received");
      console.log(this.editor);
      this.savedCode = data;

    })
    if (localStorage.getItem("code")) {
      this.savedCode = localStorage.getItem("code");
      this.lang = localStorage.getItem("lang");
    }
    setInterval(() => {
      window.localStorage.setItem("code", this.savedCode);
      window.localStorage.setItem("lang", this.lang);
    }, 5 * 1000);
},

  unmount() {
    window.localStorage.setItem("code", this.savedCode);
    window.localStorage.setItem("lang", this.lang);
  },

  data() {
    return {
      customRoomID: '',
      roomID: '',
      isConnectedToRoom: false,
      runMessage: "Run",
      input: "",
      runDisabled: false,
      output: undefined,
      showRunModal: false,
      showColabModal: false,
      fileTypeError: false,
      showWarningModal: false,
      showModal: false,
      lang: undefined,
      savedCode: '',
      editor: undefined,
      editorOptions: {
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true
      }
    };
  },
  methods: {
    sendData() {
      deb_function(this.savedCode);
    },

    debug() {
      console.log("changed");
    },

    joinRoom() {
      SocketConnectionService.joinRoom(this.customRoomID);
      this.isConnectedToRoom = true;
      this.roomID = this.customRoomID;
      this.closeColabModal();
    },

    leaveRoom(){
      SocketConnectionService.leaveRoom(this.roomID);
      this.isConnectedToRoom = false;
      this.closeColabModal();
      this.roomID = '';
    },

    createRoom() {
      this.roomID = nanoid(10);
      SocketConnectionService.createRoom(this.roomID);
      SocketConnectionService.socket.on('dataChange', data => {
        this.savedCode = data;
      });
      this.isConnectedToRoom = true;
    },

    async runCode() {
      this.output = "Running....."
      const body = {
        language: runtimes[this.lang][0],
        version: runtimes[this.lang][1],
        files: [
          {
            content: this.savedCode,
          },
        ],
        stdin: this.input,
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      };

      Axios.post("https://emkc.org/api/v2/piston/execute", body)
        .then((res) => {
          this.output = res.data.run.output;
        })
        .catch((e) => {
          console.log(e);
        });
      
      this.runDisabled = true;
      this.runMessage = "Wait"
      setTimeout(()=>{
        this.runDisabled = false;
        this.runMessage = 'Run'
      }, 5000)

    },

    clearStore() {
      localStorage.clear();
      console.log("cache cleared");
      this.closeWarningModal();
    },

    getFile() {
      const file = this.$refs.file.files[0];
      const ext = this.$refs.file.files[0].name.split(".")[1];
      if (!fileTypes.includes(ext)) {
        this.fileTypeError = true;
      } else {
        this.fileTypeError = false;
        const fr = new FileReader();
        fr.readAsText(file);
        const that = this;
        fr.onload = () => {
          that.editor.setValue(fr.result);
          that.closeModal();
        };
      }
    },

    openRunModal() {
      this.showRunModal = true;
    },

    closeRunModal() {
      this.showRunModal = false;
    },

    openColabModal() {
      this.showColabModal = true;
    },

    closeColabModal() {
      this.showColabModal = false;
    },

    openWarningModal() {
      this.showWarningModal = true;
    },

    closeWarningModal() {
      this.showWarningModal = false;
    },

    openModal() {
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
    },

    saveCode() {
      let ext = Extensions[this.lang];
      let filename = `colab-code-${Date.now()}.${ext}`;
      const blob = new Blob([this.savedCode]);
      saveAs(blob, filename);
    },

    getEditor(editor) {
      this.editor = editor;
    },

    changeLang(language) {
      this.lang = language;
      this.code = "//code here";
      if (runtimes[this.lang]) {
        this.runDisabled = false;
        this.runMessage = "Run"
      } else {
        this.runDisabled = true;
        this.runMessage = "Unsupported Language"
      }
    },
  },
  components: {
    VAceEditor,
    TopNav,
    BaseModal,
  },
};
</script>