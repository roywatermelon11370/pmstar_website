(function($) {
    $(function() {
        $(".delete").click(function(e) {
            e.preventDefault();
            var $data = $(this).data("id");
            swal({
                title: "確定要刪除嗎?",
                text: "刪除後將無法復原",
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                confirmButtonText: "我確定!",
                cancelButtonColor: '#868e96',
                cancelButtonText: "我按錯了!",
            }).then(function() {
                swal({
                    title: "刪除中",
                    text: "正在刪除，請靜候片刻",
                    type: "info",
                    showConfirmButton: false,
                    allowEnterKey: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                $.ajax({
                    url: '/admin/ann/remove',
                    type: 'POST',
                    data: { id: $data },
                    cache: false
                }).done(function() {
                    swal("成功刪除", "此消息已於最新消息中完整移除", "success").then(function() {
                        location.reload();
                    });
                }).fail(function() {
                    swal('送出失敗！', '請聯絡網站製作者', 'error');
                });
            });
        });
    });
})(jQuery);