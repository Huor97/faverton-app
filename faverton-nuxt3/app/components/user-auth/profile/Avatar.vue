<script setup>
const props = defineProps([`path`]);
const { path } = toRefs(props);

const emit = defineEmits([`update:path`, `upload`]);

const supabase = useSupabaseClient();

const uploading = ref(false);
const src = ref(``);
const files = ref();

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage.from(`avatars`).download(path.value);
    if (error) throw error;
    src.value = URL.createObjectURL(data);
  }
  catch (error) {
    console.error(`Error downloading image: `, error.message);
  }
};

const uploadAvatar = async (evt) => {
  files.value = evt.target.files;
  try {
    uploading.value = true;

    if (!files.value || files.value.length === 0) {
      throw new Error(`You must select an image to upload.`);
    }

    const file = files.value[0];
    const fileExt = file.name.split(`.`).pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from(`avatars`).upload(filePath, file);

    if (uploadError) throw uploadError;

    emit(`update:path`, filePath);
    emit(`upload`);
  }
  catch (error) {
    alert(error.message);
  }
  finally {
    uploading.value = false;
  }
};

downloadImage();

watch(path, () => {
  if (path.value) {
    downloadImage();
  }
});
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <UAvatar
      v-if="src"
      size="lg"
      chip-color="primary"
      chip-text="ÉD"
      chip-position="bottom-right"
      :src="src"
      alt="Avatar"
      @change="uploadAvatar"
    />
    <UAvatar
      v-else
      icon="i-heroicons-photo"
      size="sm"
    />

    <div>
      <label
        for="single"
      >
        {{ uploading ? 'Uploading ...' : 'Upload' }}
      </label>
      <input
        id="single"
        class="hidden absolute"
        type="file"
        accept="image/*"
        :disabled="uploading"
        @change="uploadAvatar"
      >
    </div>
  </div>
</template>
