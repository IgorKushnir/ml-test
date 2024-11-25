<template>
          <Container justify="justify-center">
        <ul class="text-list">
          <FlagshipInfoItem :title="t('appointment_timeline')">
            <span>
              {{ $t("book_text_1") }}
              <b>{{ $t("book_text_2") }}</b>
              {{ $t("book_text_3") }}
              <b>{{ $t("book_text_4") }}</b>
              {{ $t("book_text_5") }}
              <a :href="`mailto:${flagship_store_email}`">{{ $t("book_text_5_link") }}</a>
              {{ $t("book_text_5_2") }}
            </span>
          </FlagshipInfoItem>
          <FlagshipInfoItem :title="t('guest_policy')">
            <span>
              {{ $t("book_text_6") }}
              <b>{{ $t("book_text_7") }}</b>
              {{ $t("book_text_8") }}
            </span>
          </FlagshipInfoItem>
          <FlagshipInfoItem :title="t('custom_made_dresses')">
            <span>
              {{ $t("book_text_9") }}
              <b>{{ $t("book_text_10") }}</b>
              {{ $t("book_text_11") }}
            </span>
          </FlagshipInfoItem>
          <FlagshipInfoItem :title="t('pricing_production_time')">
            <span>
              {{ $t("book_text_12") }}
              <b>{{ $t("book_text_13") }}</b>
              {{ $t("book_text_14") }}
              <b>{{ $t("book_text_15") }}</b>
              {{ $t("book_text_16") }}
            </span>
          </FlagshipInfoItem>
          <FlagshipInfoItem :title="t('sample_sizes')">
            <span>
              {{ $t("book_text_17") }}
              <b>{{ $t("book_text_18") }}</b>
              {{$t("book_text_19")  }}
            </span>
          </FlagshipInfoItem>
          <FlagshipInfoItem :title="t('prepare_for_your_visit')">
            <span>
              {{ $t("book_text_20") }}
              <a href="https://warsaw.millanova.com/collections/dresses?hide_prices=true ">{{ $t("book_text_20_link") }}</a>
              {{ $t("book_text_20_2") }}
            </span>
          </FlagshipInfoItem>
        </ul>
        </Container>
        <div class="additional-text-wrap">
          <p class="additional-text">{{ $t("book_text_22") }}<b>{{ $t("book_text_23") }}</b></p>
        </div>
        <Container justify="justify-center">
        <FlagshipContactForm @goStep="(index) => goToStep(index)" />
      </Container>
      <div class="additional-text-wrap additional-text-wrap--small">
          <p class="additional-text">{{ $t("book_text_24") }}
            <a :href="`tel:${$t('flagship_store_phone')}`"><b>{{ $t('flagship_store_phone') }}</b></a>
            {{ $t("book_text_25") }}
            <a :href="`mailto:${flagship_store_email}`"><b>{{ flagship_store_email }}</b></a> <br>
            {{ $t("book_text_26") }}</p>
        </div>
</template>

<script setup>
const { t } = useI18n()
const flagship_store_email = "warsaw@millanova.com"
const emits = defineEmits(['goStep'])

const goToStep = (index) => {
  emits('goStep', index)
}
</script>

<style scoped lang="scss">

.text-list {
  padding: 0;
  margin: 0 auto;
  width: 100%;
  max-width: 950px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  column-gap: 20px;
  row-gap: 40px;
  list-style: none;
}

.additional-text-wrap {
  margin: 0 auto;
  padding: 0 32px;
  width: 100%;
  max-width: 1104px;
  text-align: center;

  &--small {
    max-width: 854px;
  }
}

.additional-text {
  margin: 8px 0;
}

@include md {
  .social {
    margin: 4px;
    font-size: 22px;
    height: auto;
    width: auto;
    padding: 12px;
  }

  .text-list {
    row-gap: 0;
  }
}

</style>