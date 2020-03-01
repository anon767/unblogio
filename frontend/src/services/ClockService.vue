<template>

</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import Events, {EventBus} from "@/services/Eventbus";

    @Component
    export default class ClockService extends Vue {
        private timer: any = null;

        mounted(): void {
            if (!this.timer) {
                this.timer = window.setInterval(() => {
                    EventBus.$emit(Events.CHECK_UPDATES);
                    console.log("fetched");
                }, 5500);
            }
        }
    }
</script>
