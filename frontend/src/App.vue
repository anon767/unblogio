<template>
    <div id="app">
        <navbar></navbar>
        <keep-alive include="mosaic">
            <router-view/>
        </keep-alive>
        <clockService></clockService>
    </div>
</template>


<style src="./assets/css/app.css">
</style>
