(function($) {
    $(function() {
        CKEDITOR.replace("NewAnnContent");
        $("#NewAnn").submit(function(e) {
            e.preventDefault();
            var content = CKEDITOR.instances.NewAnnContent.getData();
            $("#NewAnnContent").val(content);
            var $form = $("#NewAnn");
            var formdata = false;
            if (window.FormData) formdata = new FormData($form[0]);
            else formdata = $form.serialize();
            $.ajax({
                url: '/admin/ann/new',
                type: 'POST',
                data: formdata ? formdata : form.serialize(),
                cache: false,
                contentType: false,
                processData: false
            }).done(function() {
                swal("發佈成功", "已於網站中發佈最新消息", "success").then(function() {
                    location.reload();
                });
            }).fail(function() {
                swal('送出失敗！', '請聯絡網站製作者', 'error');
            });
        });
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
                console.log({ id: $data });
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