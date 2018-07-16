(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

/**
 * The base javascript for the bulk actions. This is mostly used in list views for
 * when a checkbox is checked an extra div of html will show and this class will
 * emit an event when this is done.
 */
class BulkActions extends EventEmitter {

    constructor() {
        super();

        this.$ = {};
        this.$.applyButton = $('.js-bulk-actions-apply');
        this.$.clearSelected = $('.js-bulk-actions-clear-selected');
        this.$.failed = $('.js-bulk-actions-failure');
        this.$.headerCheckBoxName = 'input[name="bulk-actions-header-checkbox"]';
        this.$.itemCheckBoxName = 'input[name="bulk-actions-item-checkbox"]';
        this.$.mainDiv = $('.js-bulk-actions');
        this.$.numberSelected = $('.js-bulk-actions-number-selected');
        this.$.options = $('.js-bulk-actions-options');
        this.$.success = $('.js-bulk-actions-success');

        this.bulkActionsCheckboxesSelected = 0;

        app.styleSelects(this.$.options, {width: '15.875rem'});
        this.$.options.val('').select3('refresh');

        this.resetBulkActionCheckBoxes();
        this.bulkActions();
    }


    events() {
        $(this.$.headerCheckBoxName).on('click', (e) => {
            let currentTarget = $(e.currentTarget);
            let headerCheckboxChecked = currentTarget.is(':checked');
            this.bulkActionsCheckboxesSelected = 0;

            $(this.$.itemCheckBoxName).each((i, el) => {
                $(el).prop('checked', headerCheckboxChecked);
                if (headerCheckboxChecked) {
                    this.bulkActionsCheckboxesSelected += 1;
                }
                this.bulkActions();
            });
            this.emit('BulkActions:checkbox', this);
        });

        $(document).on('click', this.$.itemCheckBoxName, (e) => {
            if ($(e.currentTarget).is(':checked')) {
                this.bulkActionsCheckboxesSelected += 1;
            } else {
                this.bulkActionsCheckboxesSelected -= 1;
            }
            this.bulkActions();
            this.emit('BulkActions:checkbox', e);
        });

        this.$.clearSelected.on('click', () => {
            this.resetBulkActionCheckBoxes();
        });

        // On datatable page change reset the bulk actions.
        $('#js-paging_container').on('page.dt', () => {
            this.resetBulkActionCheckBoxes();
        });
    }


    /**
     * Hide or show the div for the bulk actions.
     */
    bulkActions() {
        this.$.success.hide();
        this.$.failed.hide();
        this.$.numberSelected.html(this.bulkActionsCheckboxesSelected);


        if (this.bulkActionsCheckboxesSelected === 0) {
            this.$.mainDiv.slideUp();
            $(`${this.$.headerCheckBoxName}:checked`).prop('checked', false);
            this.emit('BulkActions:divClose', this);
        } else {
            this.$.mainDiv.slideDown();
            this.emit('BulkActions:divOpen', this);
        }
    }


    /**
     * Clear potential left-over checkboxes from previous page render.
     */
    resetBulkActionCheckBoxes() {
        // Clear global and row checkboxes.
        $(`${this.$.headerCheckBoxName}:checked,${this.$.itemCheckBoxName}:checked`).prop('checked', false);
        this.bulkActionsCheckboxesSelected = 0;
        // Reset bulk actions UI.
        this.bulkActions();
    }
}

window.BulkActions = BulkActions;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ2b2lwZ3JpZC9mcm9udGVuZC9qcy9hcHAvbGliL3ZlbmRvci9idWxrX2FjdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVGhlIGJhc2UgamF2YXNjcmlwdCBmb3IgdGhlIGJ1bGsgYWN0aW9ucy4gVGhpcyBpcyBtb3N0bHkgdXNlZCBpbiBsaXN0IHZpZXdzIGZvclxuICogd2hlbiBhIGNoZWNrYm94IGlzIGNoZWNrZWQgYW4gZXh0cmEgZGl2IG9mIGh0bWwgd2lsbCBzaG93IGFuZCB0aGlzIGNsYXNzIHdpbGxcbiAqIGVtaXQgYW4gZXZlbnQgd2hlbiB0aGlzIGlzIGRvbmUuXG4gKi9cbmNsYXNzIEJ1bGtBY3Rpb25zIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuJCA9IHt9O1xuICAgICAgICB0aGlzLiQuYXBwbHlCdXR0b24gPSAkKCcuanMtYnVsay1hY3Rpb25zLWFwcGx5Jyk7XG4gICAgICAgIHRoaXMuJC5jbGVhclNlbGVjdGVkID0gJCgnLmpzLWJ1bGstYWN0aW9ucy1jbGVhci1zZWxlY3RlZCcpO1xuICAgICAgICB0aGlzLiQuZmFpbGVkID0gJCgnLmpzLWJ1bGstYWN0aW9ucy1mYWlsdXJlJyk7XG4gICAgICAgIHRoaXMuJC5oZWFkZXJDaGVja0JveE5hbWUgPSAnaW5wdXRbbmFtZT1cImJ1bGstYWN0aW9ucy1oZWFkZXItY2hlY2tib3hcIl0nO1xuICAgICAgICB0aGlzLiQuaXRlbUNoZWNrQm94TmFtZSA9ICdpbnB1dFtuYW1lPVwiYnVsay1hY3Rpb25zLWl0ZW0tY2hlY2tib3hcIl0nO1xuICAgICAgICB0aGlzLiQubWFpbkRpdiA9ICQoJy5qcy1idWxrLWFjdGlvbnMnKTtcbiAgICAgICAgdGhpcy4kLm51bWJlclNlbGVjdGVkID0gJCgnLmpzLWJ1bGstYWN0aW9ucy1udW1iZXItc2VsZWN0ZWQnKTtcbiAgICAgICAgdGhpcy4kLm9wdGlvbnMgPSAkKCcuanMtYnVsay1hY3Rpb25zLW9wdGlvbnMnKTtcbiAgICAgICAgdGhpcy4kLnN1Y2Nlc3MgPSAkKCcuanMtYnVsay1hY3Rpb25zLXN1Y2Nlc3MnKTtcblxuICAgICAgICB0aGlzLmJ1bGtBY3Rpb25zQ2hlY2tib3hlc1NlbGVjdGVkID0gMDtcblxuICAgICAgICBhcHAuc3R5bGVTZWxlY3RzKHRoaXMuJC5vcHRpb25zLCB7d2lkdGg6ICcxNS44NzVyZW0nfSk7XG4gICAgICAgIHRoaXMuJC5vcHRpb25zLnZhbCgnJykuc2VsZWN0MygncmVmcmVzaCcpO1xuXG4gICAgICAgIHRoaXMucmVzZXRCdWxrQWN0aW9uQ2hlY2tCb3hlcygpO1xuICAgICAgICB0aGlzLmJ1bGtBY3Rpb25zKCk7XG4gICAgfVxuXG5cbiAgICBldmVudHMoKSB7XG4gICAgICAgICQodGhpcy4kLmhlYWRlckNoZWNrQm94TmFtZSkub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50VGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgICAgbGV0IGhlYWRlckNoZWNrYm94Q2hlY2tlZCA9IGN1cnJlbnRUYXJnZXQuaXMoJzpjaGVja2VkJyk7XG4gICAgICAgICAgICB0aGlzLmJ1bGtBY3Rpb25zQ2hlY2tib3hlc1NlbGVjdGVkID0gMDtcblxuICAgICAgICAgICAgJCh0aGlzLiQuaXRlbUNoZWNrQm94TmFtZSkuZWFjaCgoaSwgZWwpID0+IHtcbiAgICAgICAgICAgICAgICAkKGVsKS5wcm9wKCdjaGVja2VkJywgaGVhZGVyQ2hlY2tib3hDaGVja2VkKTtcbiAgICAgICAgICAgICAgICBpZiAoaGVhZGVyQ2hlY2tib3hDaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVsa0FjdGlvbnNDaGVja2JveGVzU2VsZWN0ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5idWxrQWN0aW9ucygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ0J1bGtBY3Rpb25zOmNoZWNrYm94JywgdGhpcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuJC5pdGVtQ2hlY2tCb3hOYW1lLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCQoZS5jdXJyZW50VGFyZ2V0KS5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYnVsa0FjdGlvbnNDaGVja2JveGVzU2VsZWN0ZWQgKz0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5idWxrQWN0aW9uc0NoZWNrYm94ZXNTZWxlY3RlZCAtPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5idWxrQWN0aW9ucygpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdCdWxrQWN0aW9uczpjaGVja2JveCcsIGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiQuY2xlYXJTZWxlY3RlZC5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0QnVsa0FjdGlvbkNoZWNrQm94ZXMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gT24gZGF0YXRhYmxlIHBhZ2UgY2hhbmdlIHJlc2V0IHRoZSBidWxrIGFjdGlvbnMuXG4gICAgICAgICQoJyNqcy1wYWdpbmdfY29udGFpbmVyJykub24oJ3BhZ2UuZHQnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0QnVsa0FjdGlvbkNoZWNrQm94ZXMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBIaWRlIG9yIHNob3cgdGhlIGRpdiBmb3IgdGhlIGJ1bGsgYWN0aW9ucy5cbiAgICAgKi9cbiAgICBidWxrQWN0aW9ucygpIHtcbiAgICAgICAgdGhpcy4kLnN1Y2Nlc3MuaGlkZSgpO1xuICAgICAgICB0aGlzLiQuZmFpbGVkLmhpZGUoKTtcbiAgICAgICAgdGhpcy4kLm51bWJlclNlbGVjdGVkLmh0bWwodGhpcy5idWxrQWN0aW9uc0NoZWNrYm94ZXNTZWxlY3RlZCk7XG5cblxuICAgICAgICBpZiAodGhpcy5idWxrQWN0aW9uc0NoZWNrYm94ZXNTZWxlY3RlZCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy4kLm1haW5EaXYuc2xpZGVVcCgpO1xuICAgICAgICAgICAgJChgJHt0aGlzLiQuaGVhZGVyQ2hlY2tCb3hOYW1lfTpjaGVja2VkYCkucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnQnVsa0FjdGlvbnM6ZGl2Q2xvc2UnLCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJC5tYWluRGl2LnNsaWRlRG93bigpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdCdWxrQWN0aW9uczpkaXZPcGVuJywgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIENsZWFyIHBvdGVudGlhbCBsZWZ0LW92ZXIgY2hlY2tib3hlcyBmcm9tIHByZXZpb3VzIHBhZ2UgcmVuZGVyLlxuICAgICAqL1xuICAgIHJlc2V0QnVsa0FjdGlvbkNoZWNrQm94ZXMoKSB7XG4gICAgICAgIC8vIENsZWFyIGdsb2JhbCBhbmQgcm93IGNoZWNrYm94ZXMuXG4gICAgICAgICQoYCR7dGhpcy4kLmhlYWRlckNoZWNrQm94TmFtZX06Y2hlY2tlZCwke3RoaXMuJC5pdGVtQ2hlY2tCb3hOYW1lfTpjaGVja2VkYCkucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5idWxrQWN0aW9uc0NoZWNrYm94ZXNTZWxlY3RlZCA9IDA7XG4gICAgICAgIC8vIFJlc2V0IGJ1bGsgYWN0aW9ucyBVSS5cbiAgICAgICAgdGhpcy5idWxrQWN0aW9ucygpO1xuICAgIH1cbn1cblxud2luZG93LkJ1bGtBY3Rpb25zID0gQnVsa0FjdGlvbnM7XG4iXX0=
