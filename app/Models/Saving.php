<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Saving extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'date',
        'note',
    ];

    /**
     * Get the user that owns the saving entry.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}