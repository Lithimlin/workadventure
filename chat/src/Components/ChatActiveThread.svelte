<script lang="ts">
    import { fly } from "svelte/transition";
    import { SettingsIcon, ArrowLeftIcon, MessageCircleIcon, RefreshCwIcon } from "svelte-feather-icons";
    import ChatMessageForm from "./ChatMessageForm.svelte";
    import LL from "../i18n/i18n-svelte";
    import { activeThreadStore, settingsViewStore } from "../Stores/ActiveThreadStore";
    import ChatUser from "./ChatUser.svelte";
    import ChatMessagesList from "./ChatMessagesList.svelte";
    import OnlineUsers from "./OnlineUsers.svelte";
    import { MucRoom } from "../Xmpp/MucRoom";
    import { onDestroy } from "svelte";
    import Loader from "./Loader.svelte";
    import { derived } from "svelte/store";

    export let activeThread: MucRoom;

    const presenceStore = activeThread.getPresenceStore();
    const readyStore = activeThread.getRoomReadyStore();
    const me = derived(activeThread.getPresenceStore(), ($presenceStore) => $presenceStore.get(activeThread.myJID));

    let messagesList: ChatMessagesList;

    onDestroy(() => {
        settingsViewStore.set(false);
    });
</script>

<!-- thread -->
<div
    id="activeThread"
    class="tw-flex tw-flex-col tw-h-full tw-min-h-full tw-over tw-w-full"
    transition:fly={{ x: 500, duration: 400 }}
>
    <div class="wa-thread-head">
        <div
            class="tw-border tw-border-transparent tw-border-r-light-purple tw-border-solid tw-py-1 tw-pr-2 tw-border-t-0 tw-border-b-0 tw-self-stretch tw-flex tw-justify-center tw-align-middle"
        >
            <button
                class="exit tw-text-lighter-purple tw-m-0"
                on:click={() => {
                    activeThreadStore.reset();
                }}
            >
                <ArrowLeftIcon />
            </button>
        </div>
        <div class="tw-text-center tw-pt-1 tw-pb-2">
            <div class="tw-flex">
                <b>{activeThread.name}</b>
                {#if activeThread.type === "live"}
                    <div class="tw-block tw-relative tw-ml-7 tw-mt-1">
                        <span
                            class="tw-w-4 tw-h-4 tw-bg-pop-red tw-block tw-rounded-full tw-absolute tw-right-0 tw-top-0 tw-animate-ping"
                        />
                        <span
                            class="tw-w-3 tw-h-3 tw-bg-pop-red tw-block tw-rounded-full tw-absolute tw-right-0.5 tw-top-0.5"
                        />
                    </div>
                {/if}
            </div>
            <OnlineUsers {presenceStore} />
        </div>
        <div
            id="settings"
            class="tw-border tw-border-transparent tw-border-l-light-purple tw-border-solid tw-py-1 tw-pl-2 tw-border-t-0 tw-border-b-0 tw-self-stretch tw-flex tw-justify-center tw-align-middle"
            on:click={() => settingsViewStore.set(!$settingsViewStore)}
        >
            <button class="tw-text-lighter-purple tw-m-0">
                {#if $settingsViewStore}
                    <MessageCircleIcon />
                {:else}
                    <SettingsIcon />
                {/if}
            </button>
        </div>
    </div>
    {#if !$readyStore}
        <Loader text={$LL.loading()} />
    {:else if $settingsViewStore}
        <div
            in:fly={{ y: -100, duration: 100, delay: 200 }}
            out:fly={{ y: -100, duration: 100 }}
            class="tw-flex tw-flex-col tw-flex-auto tw-w-full"
            style="margin-top: 52px"
        >
            <div
                class="wa-message-bg tw-border tw-border-transparent tw-border-b-light-purple tw-border-solid tw-px-5 tw-pb-0.5"
            >
                {#if $me && $me.isAdmin}
                    <button class="wa-action" type="button" on:click|stopPropagation={() => activeThread.reInitialize()}
                        ><RefreshCwIcon size="13" class="tw-mr-2" /> {$LL.reinit()}
                    </button>
                {/if}
            </div>
            <div class="wa-message-bg tw-border tw-border-transparent tw-border-b-light-purple tw-border-solid tw-px-5">
                <p class="tw-py-3 tw-text-light-blue tw-mb-0 tw-text-sm tw-flex-auto">Chatzone</p>
            </div>
            <div class="users wa-message-bg tw-border tw-border-transparent tw-border-b-light-purple tw-border-solid">
                <p class="tw-px-5 tw-py-3 tw-text-light-blue tw-mb-0 tw-text-sm tw-flex-auto">
                    {$LL.users()}
                </p>
                {#each [...$presenceStore] as [_, user]}
                    <ChatUser mucRoom={activeThread} {user} searchValue="" />
                {/each}
            </div>
        </div>
    {:else}
        <ChatMessagesList mucRoom={activeThread} bind:this={messagesList} />

        <div class="messageForm">
            <ChatMessageForm mucRoom={activeThread} on:scrollDown={messagesList.scrollDown} />
        </div>
    {/if}
</div>

<style lang="scss">
    .messageForm {
        position: fixed;
        bottom: 0;
        width: 100%;
    }
</style>
