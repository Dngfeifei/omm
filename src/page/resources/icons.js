//1 为antd内置图标库   2为第三方图标库
const OMSIcons = [
    "1_step-backward",
    "1_step-forward",
    "1_fast-backward",
    "1_fast-forward",
    "1_shrink",
    "1_arrows-alt",
    "1_down",
    "1_up",
    "1_left",
    "1_right",
    "1_caret-up",
    "1_caret-down",
    "1_caret-left",
    "1_caret-right",
    "1_up-circle",
    "1_down-circle",
    "1_left-circle",
    "1_right-circle",
    "1_double-right",
    "1_double-left",
    "1_vertical-left",
    "1_vertical-right",
    "1_vertical-align-top",
    "1_vertical-align-middle",
    "1_vertical-align-bottom",
    "1_forward",
    "1_backward",
    "1_rollback",
    "1_enter",
    "1_retweet",
    "1_swap",
    "1_swap-left",
    "1_swap-right",
    "1_arrow-up",
    "1_arrow-down",
    "1_arrow-left",
    "1_arrow-right",
    "1_play-circle",
    "1_up-square",
    "1_down-square",
    "1_left-square",
    "1_right-square",
    "1_login",
    "1_logout",
    "1_menu-fold",
    "1_menu-unfold",
    "1_border-bottom",
    "1_border-horizontal",
    "1_border-inner",
    "1_border-outer",
    "1_border-left",
    "1_border-right",
    "1_border-top",
    "1_border-verticle",
    "1_pic-center",
    "1_pic-left",
    "1_pic-right",
    "1_radius-bottomleft",
    "1_radius-bottomright",
    "1_radius-upleft",
    "1_radius-upright",
    "1_fullscreen",
    "1_fullscreen-exit",
    "1_question",
    "1_question-circle",
    "1_plus",
    "1_plus-circle",
    "1_pause",
    "1_pause-circle",
    "1_minus",
    "1_minus-circle",
    "1_plus-square",
    "1_minus-square",
    "1_info",
    "1_info-circle",
    "1_exclamation",
    "1_exclamation-circle",
    "1_close",
    "1_close-circle",
    "1_close-square",
    "1_check",
    "1_check-circle",
    "1_check-square",
    "1_clock-circle",
    "1_warning",
    "1_issues-close",
    "1_stop",
    "1_edit",
    "1_form",
    "1_copy",
    "1_scissor",
    "1_delete",
    "1_snippets",
    "1_diff",
    "1_highlight",
    "1_align-center",
    "1_align-left",
    "1_align-right",
    "1_bg-colors",
    "1_bold",
    "1_italic",
    "1_underline",
    "1_strikethrough",
    "1_redo",
    "1_undo",
    "1_zoom-in",
    "1_zoom-out",
    "1_font-colors",
    "1_font-size",
    "1_line-height",
    "1_dash",
    "1_small-dash",
    "1_sort-ascending",
    "1_sort-descending",
    "1_drag",
    "1_ordered-list",
    "1_unordered-list",
    "1_radius-setting",
    "1_column-width",
    "1_column-height",
    "1_area-chart",
    "1_pie-chart",
    "1_bar-chart",
    "1_dot-chart",
    "1_line-chart",
    "1_radar-chart",
    "1_heat-map",
    "1_fall",
    "1_rise",
    "1_stock",
    "1_box-plot",
    "1_fund",
    "1_sliders",
    "1_android",
    "1_apple",
    "1_windows",
    "1_ie",
    "1_chrome",
    "1_github",
    "1_aliwangwang",
    "1_dingding",
    "1_weibo-square",
    "1_weibo-circle",
    "1_taobao-circle",
    "1_html5",
    "1_weibo",
    "1_twitter",
    "1_wechat",
    "1_youtube",
    "1_alipay-circle",
    "1_taobao",
    "1_skype",
    "1_qq",
    "1_medium-workmark",
    "1_gitlab",
    "1_medium",
    "1_linkedin",
    "1_google-plus",
    "1_dropbox",
    "1_facebook",
    "1_codepen",
    "1_code-sandbox",
    "1_amazon",
    "1_google",
    "1_codepen-circle",
    "1_alipay",
    "1_ant-design",
    "1_ant-cloud",
    "1_aliyun",
    "1_zhihu",
    "1_slack",
    "1_slack-square",
    "1_behance",
    "1_behance-square",
    "1_dribbble",
    "1_dribbble-square",
    "1_instagram",
    "1_yuque",
    "1_alibaba",
    "1_yahoo",
    "1_reddit",
    "1_sketch",
    "1_account-book",
    "1_alert",
    "1_api",
    "1_appstore",
    "1_audio",
    "1_bank",
    "1_bell",
    "1_book",
    "1_bug",
    "1_bulb",
    "1_calculator",
    "1_build",
    "1_calendar",
    "1_camera",
    "1_car",
    "1_carry-out",
    "1_cloud",
    "1_code",
    "1_compass",
    "1_contacts",
    "1_container",
    "1_control",
    "1_credit-card",
    "1_crown",
    "1_customer-service",
    "1_dashboard",
    "1_database",
    "1_dislike",
    "1_environment",
    "1_experiment",
    "1_eye-invisible",
    "1_eye",
    "1_file-add",
    "1_file-excel",
    "1_file-exclamation",
    "1_file-image",
    "1_file-markdown",
    "1_file-pdf",
    "1_file-ppt",
    "1_file-text",
    "1_file-unknown",
    "1_file-word",
    "1_file-zip",
    "1_file",
    "1_filter",
    "1_fire",
    "1_flag",
    "1_folder-add",
    "1_folder",
    "1_folder-open",
    "1_frown",
    "1_funnel-plot",
    "1_gift",
    "1_hdd",
    "1_heart",
    "1_home",
    "1_hourglass",
    "1_idcard",
    "1_insurance",
    "1_interaction",
    "1_layout",
    "1_like",
    "1_lock",
    "1_mail",
    "1_medicine-box",
    "1_meh",
    "1_message",
    "1_mobile",
    "1_money-collect",
    "1_pay-circle",
    "1_notification",
    "1_phone",
    "1_picture",
    "1_play-square",
    "1_printer",
    "1_profile",
    "1_project",
    "1_pushpin",
    "1_property-safety",
    "1_read",
    "1_reconciliation",
    "1_red-envelope",
    "1_rest",
    "1_rocket",
    "1_safety-certificate",
    "1_save",
    "1_schedule",
    "1_security-scan",
    "1_setting",
    "1_shop",
    "1_shopping",
    "1_skin",
    "1_smile",
    "1_sound",
    "1_star",
    "1_switcher",
    "1_tablet",
    "1_tag",
    "1_tags",
    "1_tool",
    "1_thunderbolt",
    "1_trophy",
    "1_unlock",
    "1_usb",
    "1_video-camera",
    "1_wallet",
    "1_apartment",
    "1_audit",
    "1_barcode",
    "1_bars",
    "1_block",
    "1_border",
    "1_branches",
    "1_ci",
    "1_cloud-download",
    "1_cloud-server",
    "1_cloud-sync",
    "1_cloud-upload",
    "1_cluster",
    "1_coffee",
    "1_copyright",
    "1_deployment-unit",
    "1_desktop",
    "1_disconnect",
    "1_dollar",
    "1_download",
    "1_ellipsis",
    "1_euro",
    "1_exception",
    "1_export",
    "1_file-done",
    "1_file-jpg",
    "1_file-protect",
    "1_file-sync",
    "1_file-search",
    "1_fork",
    "1_gateway",
    "1_global",
    "1_gold",
    "1_history",
    "1_import",
    "1_inbox",
    "1_key",
    "1_laptop",
    "1_link",
    "1_line",
    "1_loading-3-quarters",
    "1_loading",
    "1_man",
    "1_menu",
    "1_monitor",
    "1_more",
    "1_number",
    "1_percentage",
    "1_paper-clip",
    "1_pound",
    "1_poweroff",
    "1_pull-request",
    "1_qrcode",
    "1_reload",
    "1_safety",
    "1_robot",
    "1_scan",
    "1_search",
    "1_select",
    "1_shake",
    "1_share-alt",
    "1_shopping-cart",
    "1_solution",
    "1_sync",
    "1_table",
    "1_team",
    "1_to-top",
    "1_trademark",
    "1_transaction",
    "1_upload",
    "1_user-add",
    "1_user-delete",
    "1_usergroup-add",
    "1_user",
    "1_usergroup-delete",
    "1_wifi",
    "1_woman",
    '2_iconbiaodanpeizhi',
    '2_iconliucheng',
    '2_iconyuanshujuguanli',
    '2_iconyuanshujuguanli1',
    '2_iconguanli',
    '2_iconbohui',
    '2_iconqianjiaqian',
    '2_iconshenpi',
    '2_icontijiao',
    '2_iconbaocun',
    '2_iconaudit01',
    '2_iconOA-transfer',
    '2_iconchexiao',
    '2_iconxinxiguanli1',
    '2_iconxitongpeizhi1',
    '2_iconxitongguanli',
    '2_iconshengchanguanli',
    '2_iconquanxianguanli',
    '2_icontongyongshezhi',
    '2_iconxinxiguanli',
    '2_iconliuchengtu',
    '2_icontongyonggongju',
    '2_icondianzan',
    '2_iconguanbi',
    '2_iconpinglun',
    '2_iconlishi',
    '2_iconshoucang',
    '2_iconshouye',
    '2_iconwode',
    '2_iconwenda',
    '2_iconshanchu',
    '2_iconsousuo',
    '2_iconzuopin'
]
export {
    OMSIcons
}