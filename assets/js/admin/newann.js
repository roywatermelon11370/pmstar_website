(function($) {
    $(function() {
        CKEDITOR.replace("NewAnnContent");
        $("#NewAnn").submit(function(e) {
            e.preventDefault();
            swal({
                title: "發佈中",
                text: "正在發佈，若是上傳檔案較大可能需花稍久之時間，請靜候片刻",
                type: "info",
                showConfirmButton: false,
                allowEnterKey: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            });
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
    });
})(jQuery);