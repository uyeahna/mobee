<template> 
  <div id="modal">
      <div id="overlay" @click="$emit('close-modal')">
      </div>
      <div id="modal-card"> 
        <slot />
      </div>
  </div> 
</template> 
<script>

  export default {
    name: 'ModalView'
  }; 
</script> 
<style> /* Modal */ 
#modal, #overlay { 
  width: 100%; height: 100%; position: fixed; left: 0; top: 0; 
} 
#overlay {
  opacity: 0.7; background-color: black; 
} 

#modal-card { 
  position: relative;
  margin-top: 100px;
  } 
</style>