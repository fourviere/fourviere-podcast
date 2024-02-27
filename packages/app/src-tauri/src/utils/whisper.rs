use kalosm_sound::{WhisperLanguage, WhisperSource};
pub fn whisper_model(value: &str) -> WhisperSource {
    match value {
        "Tiny" => WhisperSource::Tiny,
        "TinyEn" => WhisperSource::TinyEn,
        "Base" => WhisperSource::Base,
        "BaseEn" => WhisperSource::BaseEn,
        "Small" => WhisperSource::Small,
        "SmallEn" => WhisperSource::SmallEn,
        "Medium" => WhisperSource::Medium,
        "MediumEn" => WhisperSource::MediumEn,
        "Large" => WhisperSource::Large,
        "LargeV2" => WhisperSource::LargeV2,
        "DistilMediumEn" => WhisperSource::DistilMediumEn,
        "DistilLargeV2" => WhisperSource::DistilLargeV2,
        _ => WhisperSource::Base,
    }
}
pub fn whisper_lang(value: &str) -> WhisperLanguage {
    match value {
        "en" => WhisperLanguage::English,
        "zh" => WhisperLanguage::Chinese,
        "de" => WhisperLanguage::German,
        "es" => WhisperLanguage::Spanish,
        "ru" => WhisperLanguage::Russian,
        "ko" => WhisperLanguage::Korean,
        "fr" => WhisperLanguage::French,
        "ja" => WhisperLanguage::Japanese,
        "pt" => WhisperLanguage::Portuguese,
        "tr" => WhisperLanguage::Turkish,
        "pl" => WhisperLanguage::Polish,
        "ca" => WhisperLanguage::Catalan,
        "nl" => WhisperLanguage::Dutch,
        "ar" => WhisperLanguage::Arabic,
        "sv" => WhisperLanguage::Swedish,
        "it" => WhisperLanguage::Italian,
        "id" => WhisperLanguage::Indonesian,
        "hi" => WhisperLanguage::Hindi,
        "fi" => WhisperLanguage::Finnish,
        "vi" => WhisperLanguage::Vietnamese,
        "he" => WhisperLanguage::Hebrew,
        "uk" => WhisperLanguage::Ukrainian,
        "el" => WhisperLanguage::Greek,
        "ms" => WhisperLanguage::Malay,
        "cs" => WhisperLanguage::Czech,
        "ro" => WhisperLanguage::Romanian,
        "da" => WhisperLanguage::Danish,
        "hu" => WhisperLanguage::Hungarian,
        "ta" => WhisperLanguage::Tamil,
        "no" => WhisperLanguage::Norwegian,
        "th" => WhisperLanguage::Thai,
        "ur" => WhisperLanguage::Urdu,
        "hr" => WhisperLanguage::Croatian,
        "bg" => WhisperLanguage::Bulgarian,
        "lt" => WhisperLanguage::Lithuanian,
        "la" => WhisperLanguage::Latin,
        "mi" => WhisperLanguage::Maori,
        "ml" => WhisperLanguage::Malayalam,
        "cy" => WhisperLanguage::Welsh,
        "sk" => WhisperLanguage::Slovak,
        "te" => WhisperLanguage::Telugu,
        "fa" => WhisperLanguage::Persian,
        "lv" => WhisperLanguage::Latvian,
        "bn" => WhisperLanguage::Bengali,
        "sr" => WhisperLanguage::Serbian,
        "az" => WhisperLanguage::Azerbaijani,
        "sl" => WhisperLanguage::Slovenian,
        "kn" => WhisperLanguage::Kannada,
        "et" => WhisperLanguage::Estonian,
        "mk" => WhisperLanguage::Macedonian,
        "br" => WhisperLanguage::Breton,
        "eu" => WhisperLanguage::Basque,
        "is" => WhisperLanguage::Icelandic,
        "hy" => WhisperLanguage::Armenian,
        "ne" => WhisperLanguage::Nepali,
        "mn" => WhisperLanguage::Mongolian,
        "bs" => WhisperLanguage::Bosnian,
        "kk" => WhisperLanguage::Kazakh,
        "sq" => WhisperLanguage::Albanian,
        "sw" => WhisperLanguage::Swahili,
        "gl" => WhisperLanguage::Galician,
        "mr" => WhisperLanguage::Marathi,
        "pa" => WhisperLanguage::Punjabi,
        "si" => WhisperLanguage::Sinhala,
        "km" => WhisperLanguage::Khmer,
        "sn" => WhisperLanguage::Shona,
        "yo" => WhisperLanguage::Yoruba,
        "so" => WhisperLanguage::Somali,
        "af" => WhisperLanguage::Afrikaans,
        "oc" => WhisperLanguage::Occitan,
        "ka" => WhisperLanguage::Georgian,
        "be" => WhisperLanguage::Belarusian,
        "tg" => WhisperLanguage::Tajik,
        "sd" => WhisperLanguage::Sindhi,
        "gu" => WhisperLanguage::Gujarati,
        "am" => WhisperLanguage::Amharic,
        "yi" => WhisperLanguage::Yiddish,
        "lo" => WhisperLanguage::Lao,
        "uz" => WhisperLanguage::Uzbek,
        "fo" => WhisperLanguage::Faroese,
        "ht" => WhisperLanguage::HaitianCreole,
        "ps" => WhisperLanguage::Pashto,
        "tk" => WhisperLanguage::Turkmen,
        "nn" => WhisperLanguage::Nynorsk,
        "mt" => WhisperLanguage::Maltese,
        "sa" => WhisperLanguage::Sanskrit,
        "lb" => WhisperLanguage::Luxembourgish,
        "my" => WhisperLanguage::Myanmar,
        "bo" => WhisperLanguage::Tibetan,
        "tl" => WhisperLanguage::Tagalog,
        "mg" => WhisperLanguage::Malagasy,
        "as" => WhisperLanguage::Assamese,
        "tt" => WhisperLanguage::Tatar,
        "haw" => WhisperLanguage::Hawaiian,
        "ln" => WhisperLanguage::Lingala,
        "ha" => WhisperLanguage::Hausa,
        "ba" => WhisperLanguage::Bashkir,
        "jw" => WhisperLanguage::Javanese,
        "su" => WhisperLanguage::Sundanese,
        _ => WhisperLanguage::English,
    }
}
